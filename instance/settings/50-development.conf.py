if RUNNING_MODE == Mode.Development:
    DEBUG = True

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, RUNNING_MODE_NAME + '.sqlite3'),
        }
    }

    try:
        import rest_framework_swagger
        INSTALLED_APPS += ['rest_framework_swagger']
    except ImportError:
        pass


