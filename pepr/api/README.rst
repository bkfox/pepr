PEPR Api
========

This application offers consumers used to provide a rest API usable through websockets:

- RouterConsumer: class that route incoming requests to consumers or views using message's ``path`` attribute;
- ObserverConsumer: observe and notifies of changes of specific model instances. This base class is reused by ``perms.consumers.AccessibleObserver`` and ``content.consumers.ContentObserver``;
- Switch: handles multiple consumers lifecycle;
- Request: offer HttpRequest's interface usable by both views and consumers;

