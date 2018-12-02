# PEPR
Collaborative social media.

## Installation

From pepr's directory, setup virtual environment and install dependencies:

```
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

Configuration is done through files in `instance/settings/XX-*.conf.py`.
For the moment testing mode is activated and the one by default.


## Architecture
Pepr is provided as a full-featured platform.

Code is organized under the following modules:

- ``instance``: django project instance module;
- ``pepr.api``: base API classes and utilities
- ``pepr.bootstrap``: higher-level components and services;
- ``pepr.content``: content and containers editable by users;
- ``pepr.perms``: permission system, based on Role and Access;
- ``pepr.ui``: user interface base class, providing Components, Widgets, etc.;
- ``pepr.utils``: various useful modules

## TODO
### Environment
- default settings for production and development
- perms tests
- setup channels & rest api
- integrate components and content

- tests: write base models to allow tests
- widgets: widget model: how do we set a container for widget? Do we use Content's Container as before?
- widgets: tests
- perms: write tests


