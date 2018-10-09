if RUNNING_MODE == Mode.Development:
    DEBUG = True

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'dev.sqlite3'),
        }
    }
    ALLOWED_HOSTS = ['127.0.0.1:8000','localhost:8000']



