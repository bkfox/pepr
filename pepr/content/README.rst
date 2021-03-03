PEPR Content
============

This application offers base classes for content and container management. There
are three main elements:

- ``Content``: object that has content and can be posted on a ``Container`` (e.g.: post, article, event, etc.);
- ``Container``: a Context that is used to regroup content (e.g.: space, user page, message thread);
- ``Service``: configure a view used to render Content objects on a Container (e.g.: stream, calendar, etc.);

They both are ``Accessible`` object in order to correctly handle access and permissions.
