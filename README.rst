PEPR
====

Pepr is a collaborative social media (free software): it provides a social media that can be used for
both internal collaboration and as a public website. Everything is organized around *Containers* to which people
post content, reply, or use different services (calendar, discussion, etc.). A Container can be a public page, user group, discussion, etc.

Pepr provides a permission system that allows users to easily control who can access content they publish. This allows multiple use cases.

It also takes advantage of Web technologies in order to receive notifications in realtime.

**Note: this project is under development and not yet ready for production.**


Technical Features
------------------

- Django, RestFramework, VueJS, Bootstrap-Vue
- Websockets for realtime notifications and publish-subscribe;
- Permission system based on roles and content access level. User roles and permissions are defined
  on a context basis;
- Provide tools for API: application urlpatterns gathering, routing request to different consumers;
- Pubsub: over a single or multiple object instance, based on filters;
- Components and widgets: page-fragments that can be rendered inside pages. Multiple basic widgets are already provided;
- Widgets slots: gather and render multiple widgets at one place (e.g. an customizable menu);


Installation
------------

From pepr's directory, setup virtual environment and install dependencies:

.. code-block:: bash

    virtualenv venv
    source venv/bin/activate
    pip install -r requirements.txt

Configuration is done through files in ``instance/settings/XX-*.conf.py``. Files ``50-development.conf.py``, ``50-production.conf.py`` and ``50-testing.conf.py`` include configuration for the different running modes. It also contains database configuration. For the moment development mode is activated by default (in ``instance/settings.py``, later a CLI argument should come along).


Migrations
~~~~~~~~~~

Since we are in early stages of development, migrations are not yet present in repository. You need to generate them, and once database is configured, you can migrate:

.. code-block:: bash
    # create migrations
    ./manage.py makemigrations # or if not working: 
    ./manage.py makemigrations pepr_perms pepr_content pepr_ui pepr_bootstrap

    # run migrations
    ./manage.py migrate --fake-initial

If you need to create a super-user, now it is the time:

.. code-block:: bash
    ./manage.py createsuperuser

Architecture
------------
Pepr is provided as a full-featured platform, at provides server-side framework and client.

Code is organized under the following modules:

- ``instance``: django project instance module;
- ``pepr.api``: base API classes and utilities
- ``pepr.bootstrap``: higher-level components and services;
- ``pepr.content``: content and containers editable by users;
- ``pepr.perms``: permission system, based on Role and Access;
- ``pepr.ui``: user interface base class, providing Components, Widgets, etc.;
- ``pepr.utils``: various useful modules

