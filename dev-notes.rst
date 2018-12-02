TODO
====

- Settings:
   - ContextForm
     - how to handle combined ContextForm & AccessibleForm
       they might well combine, each doing its job with correct role
       assigned (which might yet be done <3)
   - Api endpoint for Container:
     - ContextViewSet & combine with accessible
     - api-* on form

2018-11-29 00:05:02,653 - ERROR - server - Exception inside application: Set of coroutines/Futures is empty.
  File "/media/data/courants/projets/pepr/venv/lib/python3.7/site-packages/channels/sessions.py", line 175, in __call__
    return await self.inner(receive, self.send)
  File "/media/data/courants/projets/pepr/venv/lib/python3.7/site-packages/channels/middleware.py", line 41, in coroutine_call
    await inner_instance(receive, send)
  File "/media/data/courants/projets/pepr/pepr/api/consumers.py", line 256, in __call__
    await my_call
  File "/media/data/courants/projets/pepr/pepr/api/consumers.py", line 251, in __call__
    await my_call
  File "/media/data/courants/projets/pepr/venv/lib/python3.7/site-packages/channels/consumer.py", line 54, in __call__
    await await_many_dispatch([receive, self.channel_receive], self.dispatch)
  File "/media/data/courants/projets/pepr/venv/lib/python3.7/site-packages/channels/utils.py", line 50, in await_many_dispatch
    await dispatch(result)
  File "/media/data/courants/projets/pepr/venv/lib/python3.7/site-packages/channels/consumer.py", line 67, in dispatch
    await handler(message)
  File "/media/data/courants/projets/pepr/venv/lib/python3.7/site-packages/channels/generic/websocket.py", line 244, in websocket_disconnect
    await self.disconnect(message["code"])
  File "/media/data/courants/projets/pepr/pepr/api/consumers.py", line 339, in disconnect
    await self.switch.disconnect()
  File "/media/data/courants/projets/pepr/pepr/api/switch.py", line 231, in disconnect
    timeout=self.consumer_close_timeout
  File "/usr/lib64/python3.7/asyncio/tasks.py", line 354, in wait
    raise ValueError('Set of coroutines/Futures is empty.')
  Set of coroutines/Futures is empty.
]


Per application:
- UI:
   - templates:
      - form.html: aria- attributes based on field.label and field.help_text (cf. content_form.html)
   - collection:
      - load paginated content; auto-load
      - pagination (for static)
      - sort: handle date and direction
   - file upload
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
      - filters
      - page loading
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



Observers & Collections
-----------------------
- Impl Collection binding
- Load list & pagination
- Filters

Stream
------
- Create new post
- Edit content

Content
-------
- Attach resources: edit & rendering
