import datetime

import django.utils.timezone as tz


def format_date(date):
    """
    Format a date or a datetime based on locale.
    """
    if isinstance(date, tz.datetime):
        return '{}, {}'.format(
            date_format(date, format='SHORT_DATE_FORMAT', use_l10n=True),
            date_format(date, format='H:i')
        )
    return date_format(date, format='SHORT_DATE_FORMAT', use_l10n=True)


def cast_date(date, to_datetime = True):
    """
    Given a date reset its time information and
    return it as a date or datetime object.

    Ensure timezone awareness.
    """
    if to_datetime:
        return tz.make_aware(
            tz.datetime(date.year, date.month, date.day, 0, 0, 0, 0)
        )
    return datetime.date(date.year, date.month, date.day)


def date_or_now(date, reset_time = False, keep_type = False,
                    to_datetime = True):
    """
    Return datetime or default value (now) if not defined, and remove time info
    if reset_time is True.

    @param reset_time   reset time info to 0
    @param keep_type    keep the same type of the given date if not None
    @param to_datetime  force conversion to datetime if not keep_type

    Ensure timezone awareness.
    """
    date = date or tz.now()
    to_datetime = isinstance(date, tz.datetime) if keep_type else to_datetime

    if reset_time or not isinstance(date, tz.datetime):
        return cast_date(date, to_datetime)

    if not tz.is_aware(date):
        date = tz.make_aware(date)
    return date


