PEPR Permission management
==========================
In PEPR, permissions management handles two different systems:

- by **access level**: used to determine which elements user has a read-access to.
- by **permission**: used to determine if user can do an action.


This is done through a role system, where each ``Role`` is statically defined and
accessible through the server instance. Each Role has a unique access level
(higher is more power) that is both used as a refering id in database, and
giving *access level* to the user. It also defines a set of permissions that
allows or deny actions to users.

A ``Role`` is assigned to the user for a given ``Context``, to which user is
subscribed. This allows user to have different kind of role depending on the
which context the request is processed. Note that special cases are also
handled for e.g. anonymous user or super-users.

A Context gather together different models:

- ``Subscription``: defines a Role for a user, can be extended to define
    more subscription informations;
- ``Authorization``: used to override default permissions set for a specific
    role;
- ``Accessible``: abstract class providing basic access filtering for
    elements inside a context, etc;

This system can respond to many use case while keeping it simple: subscriptions,
invitations, sharing, container visibility/publicity, external-users, etc.

