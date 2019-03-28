PEPR Api
========

This application provides mechanisms to handle rest API over Django Channels consumers (through WebSockets). It also includes others utilities.

**Features:**

- Route consumer requests to regular django views and/or consumers (handling their lifetime).
- ``ViewSet`` for consumers;
- *Publish-Subscribe* consumer handling multiple subscriptions and different filters;
- Low-level Channels message dispatching through multiple consumers;

**Classes:**
- ``consumers.RouterConsumer`` routes incoming requests to registered views or consumers;
- ``mixins.ConsumerSetMixin`` adds interface similar to ``ViewSet``, where ``@action`` can be used;
- ``pubsub.PubsubConsumer`` base class used to create *pubsub* consumers;
- ``request.RouterRequest`` Django's ``HttpRequest`` that can be used both with DRF and consumers;
- ``switch.Switch`` dispatch message to multiples upstream consumers, handling their lifetime too;

- Request: offer HttpRequest's interface usable by both views and consumers;

