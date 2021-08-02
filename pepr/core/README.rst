Pepr Core
==========
Core libraries for Pepr, handling permissions and application management.

Features:
- ACL and role based permission system:
    - Per object access level;
    - Multiple identities for a single user;
    - Invitation, subscription request, and automatic approval;
    - middleware, views, mixins, and template;
    - consumer (not implemented);
- Vue applications integration and components;
- Application urls, api urls and consumers discovery;
- Django settings utilities;


Permissions
-----------
Users are assigned to ``Role``-s based on current ``Context`` and their
subscriptions.

Context is the container of other objects subjects to permissions.
It aims to be generic enough to be used over multiple use cases: group
discussion, user profile (as identity), public page, pictures galery, etc.

For each role there is:

- **access level**: visibility level to read elements inside a level;
- **permissions**: set of granted or forbidden actions;

For each ``Context``, there are:

- ``Subscription``: assign role to users' identities;
- ``Accessible``: base abstract model adding access control to objects;
- ``Owned``: add ownership to accessibles;
- ``Authorization``: override default permission of a role;
- ``Service``: end-user application (as accessible);


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


Authorization
.............

``Authorization`` are the stored version of a ``Permission``, allowing end-users to
configure permissions for each role of a given Context. In respect of access
hierarchy , users with lower access level don't have access to Authorization
of higher read access level (this keeps control over unwanted permission changes).

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




