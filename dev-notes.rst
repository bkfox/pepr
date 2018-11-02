TODO
====

Per application:
- UI:
   - collection:
      - load paginated content; auto-load
      - pagination (for static)
      - sort: handle date and direction
   - file upload
- Perms:
   - Reusable permission editor view form
- Content:
   - Content:
      - derive from OwnedAccessible
      - action: delete, edit, bookmark, share
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

To-think / features:
- activities: how do we handle activities
- user page
- messaging: messaging between users or container (e.g.: groups)
   -> messaging is equivalent to share a container between two containers
      (shared container is a message thread)



Not determined:
- API:
   - generic mixin & integration with observer
   - observer with different filters


Tests
-----
- perms:
   - Authorization with-out model
   - Permission with-out model
   - OwnedAccessibleQuerySet.user()
   - OwnedAccessible using Subscription model
   - Subscription, Authorization
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
