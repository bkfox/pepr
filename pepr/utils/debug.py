from django.conf import settings
import traceback, sys

def report_error():
    if not settings.DEBUG:
        return {'data': {'detail': 'internal error'}}

    traceback.print_exc(file=sys.stdout)
    exc_type, exc_value, exc_traceback = sys.exc_info()
    return {'data': {
        'detail': 'an exception occured: {}'.format(
            traceback.format_exception(
                exc_type, exc_value, exc_traceback
            )
        )
    }}

