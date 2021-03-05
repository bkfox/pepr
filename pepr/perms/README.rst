Pepr Perms
==========
In PEPR, permissions management is done using a system composed of two mains
aspects:

- **access level**: determines which elements user has a read-access to by the
  comparison of access. It also is used to determine the role of a user;
- **permission**: determines if user can do an action (for a specific model or
  not);


Thoses are always defined inside a Context, which is used to regroup subscriptions,
permissions, and elements than can be accessed by users (``Accessible``).

``Role`` is the link between an access level and a set of permissions (only one role
per access level is allowed), It is used to check over permissions and access
grants inside a given context. Role is retrieved for the user directly from the related
``Context`` instance, allowing to override user's role based on its subscription (done by default for anonymous and super users).

Different models are related to a ``Context``:

- ``Accessible``: abstract model providing basic access filtering for
    elements inside a context based on user, etc;
- ``OwnedAccessible``: abstract Accessible with ownership management.
   Its attribute ``owner`` targets a Django User.
- ``Subscription``: assigns a Role to a user, can be extended to define
    more subscription informations;
- ``Authorization``: used to override default permissions set for a specific
    role;

This system can respond to many use case while keeping it simple: subscriptions,
invitations, sharing, container visibility/publicity, external-users, etc.


Example
-------

Setup
.....

Inside **models.py**:

.. code-block:: python
    from django.db import models
    from pepr.perms.models import Accessible, Context
    from pepr.perms.roles import MemberRole


    class Dashboard(Context):
       title = models.CharField(max_length=64)

    class Note(OwnedAccessible):
       content = models.TextField()

Simple setup:

.. code-block:: python
    # user is retrieved from view's request.user

    from django.auth.models import User
    from pepr.perms.models import Context, Accessible, Subscription
    from pepr.perms.roles import MemberRole, ModeratorRole

    from .models import Dashboard, Note

    # create a context
    dashboard = Dashboard(title="my dashboard")
    dashboard.save()


    # set user's subscription
    subscription = Subscription(context = dashboard,
                                owner = user,
                                access = MemberRole.access)
    subscription.save()

    # create multiple notes with different access levels
    for i in range(0, 10):
       note = Note(context = context
                   access = MemberRole.access if i % 2 else
                            ModeratorRole.access,
                   content = 'this is note number {}'.format(i))
       note.save()

Accessibles
...........

.. code-block:: python
    # get all notes user has access to
    notes = Notes.objects.user(user)

    # for a given context
    notes = notes.context(dashboard)

    # user's role
    role = dashboard.get_role(user)


Design considerations
---------------------

The following consideration emerged while developping the permission system as
good set of principle:

- **Access defines the privilege level of users, and is related to a specific
  set of permissions by the intermediary of Roles**: this is how everything
  works.
- **User's permissions (read, write and others) are only granted for objects
  he has access to:** access is granted when user's access is higher or equal
  to object's one. Access level is the key to object manipulation in respect
  of roles hierarchy;
- **User can only set access that is lower or equal to its own access level on
  objects:** this reduces the risk of privilege escalation and ensures controls
  over objects access;
- **Owner always has read and write access to objects he owns:** this is really
  important to respect the right for users to keep control of what they own
  (or produce if this is the use case of the ownership);
- **The only implicit privilege given by sufficient access level is to read**;


Others:
- because Context is an Accessible, permissions related to the current one
are not linked to a ``model``;


Authorization
.............

``Authorization`` are the stored version of a ``Permission``, allowing end-users to
configure permissions for each role of a given Context. In respect of access
hierarchy , users with lower access level don't have access to Authorization
of higher access level (this keeps control over unwanted permission changes).
Note that "having access" does not means "having the permission to change".

Subscription
............

``Subscription`` defines an access level for Django User in a specific Context.
It is an ``OwnedAccessible`` whose owner is the related user, allowing user's to
always have control over its subscriptions. Being an Accessible offers the same
advantages than for an Authorization.

Subscription on a Role can have a different access level, due to special roles
such as for super-users and anonymous users. This allows a slight difference between
each other: subscriptions defines the relation to a Context for a given user while the
role gives the user accesses and permissions.

Subscriptions aims to be used as common base for a membership system: invitation,
following, subscribing.

Usage in Pepr
.............

In Pepr the permission system is the backbone of the project: it ensures permissions
management while providing base models for most applications content.
Views mostly inherit from ``AccessibleView`` in order to enforce the idea that there
always is a permission context user acts in..

TODO & FIXME
------------

- settings: validation of admin role and anonymous' role, expose as attribute.
- set of basic/common Permissions + add example

- role ``has_perm()`` calling a method on Permission: this allows more control
  from ``Permission`` object and makes it interesting to use subclassing; what
  about side-effects and code coherence etc.
- split Permission description & Permission granting (or at least a clearer scheme)
- Permission description can use format() argument on related model; or provide
  ``get_description`` instance (class?) method.




