# Permission management
Permission management is done through a role system. Each Role defines a set of
permissions and an 'access level' used as unique id for the role. Roles are
automatically registered to Roles (using metaclass). Thoses objects are
statically declared.

A Context is a model that defines a set of Subscription (users assignment to a
specific Role), and a set of Authorization (dynamic permissions that user can
defines). Accessible objects are object that can be accessed based on user's
access level, and are always related to a defined Context.


## TODO
- documentation
- tests
- check user subscription and role assignment api
- subscription by auth.Group or for external users (based on token or whatever)



