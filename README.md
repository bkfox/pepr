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


