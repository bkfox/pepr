from rest_framework.response import Response as RestResponse


def handle_exception(exception, status=500):
    """
    When given exception: occured, return an error response.
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except exception as error:
                return RestResponse({
                    'content': 'An error occured: '.format(error)
                }, status)
        return wrapper
    return decorator


