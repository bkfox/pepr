if RUNNING_MODE == Mode.Testing:
    INSTALLED_APPS += ['pepr.tests']
    DEBUG = True

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'testing.sqlite3'),
        }
    }



