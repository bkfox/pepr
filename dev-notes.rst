TODO
====

Todo now
--------


- **next (client)**:
  - load edit modal
  - actions & content actions (menu & modal)
  - subscriptions edit

- Users:
    - perms:
        - context class attr: is_actor + qs actors()
        - owned.owner => choice is_actor
        - context.title => context.name ?
    - actor api & integrations:
        - user and actor
        - API: base + user's actors selector
          -
        - 
    - ui: adapt if required

- perms:

- modal:
   - close when no html content => response is json || or just hide() by rendered component,
     on demand??? how to when request result from a submit event and we need request
     result before closing
   - error handling
x subscriptions:
   x add subscription access policy on context
   x adapt queryset for subscriptions -> no need since access and role are different
   x viewset filters => context, access
   x Subscription permissions & serializer & endpoint
- client
   - resources:
      x load from url: reset options
      x pagination & load next
      - items selection (multiple, single) + @select event on collection
   - user pick:
      - template
      - search for user
   - subscriptions:
      - template
      - form submission
      - action: multiple selection
      - invite user

Todo-ToFix
----------
- utils.strings => camel case to [...], handles cases such as XMLHttpRequest -> xml_http_request
- perms/content/..., context.get_role called multiple times when retrieving multiple
    objects for the same context

Todo-Doc
--------
- Action system
- pepr_ui templatetags

To-think
-------
- Client:
   - POST forms: error handling & user feedback + flow
   - Permission implementation client side

- Permissions:
   - ensure an Admin exists at context creation
   - Accessible => pk => uuid: because accessible means to be accessible...
   - permission granted:
      - can be forbidden: authorization cant be set by end users
      - can be default: (instead of delete authorization?)

- Settings:
   - Api endpoint for Container:
     - ContextViewSet & combine with accessible
     - api-* on form


Per application:
- UI:
   - templates:
      - form.html: aria- attributes based on field.label and field.help_text (cf. content_form.html)
   - collection:
      - load paginated content; auto-load
      - pagination (for static)
      - autcompletion:
         - pepr-autocomplete-field: rename, focus/blur, hide/show list
         - pepr-autocomplete
   - webpack & organization into ".vue" components & js module
   - accessibility: aria-* everywhere
- API:
   - FILES & file upload over ws
- Perms:
   - Reusable permission editor view form
   x templatetags: "role" filter ("container|role:request.user")
- Content:
   - Content:
      x derive from OwnedAccessible
      - action: x - delete, x - edit, bookmark, share
      - comments
      - sharing
      - attach resources/files
   - Container:
      - creation, management
      - cf. services
      - subscription mgt, access, etc. => in perms too?
   - Service:
      - enable/disable/add/default service; configure
      - with(out) container;
      - how to handle service creation/enabling, etc.
- Bootstrap:
   - StreamView:
      - filters & loading: cf. ui
      - multiple forms
- Utils:
   - functional: rename into decorators? + update readme
   - fields: fix ReferenceField & run_validators (when saving from admin)
      => might a bigger bug

To-think / features:
- activities: how do we handle activities
- user page
- messaging: messaging between users or container (e.g.: groups)
   -> messaging is equivalent to share a container between two containers
      (shared container is a message thread)
- instance:
   - load urls based on settings or someway dynamically without over-dynamism
     ! KISS !


Not determined:
- API:
   - generic mixin & integration with observer
   - observer with different filters


Choices
-------

- actions:
  idea: actions using a single template over p-list and add a field "actions"
        to serialized object => 


Tests
-----
- ui:
   - component
   - widgets: views & models, with-out perms
   - template_tags
- api:
   - consumers: RouterConsumerBase, RouterConsumer, Observer
   - mixins; switch; request
- utils


