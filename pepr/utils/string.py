
def camel_to_snake(value, sep = '_'):
    # we avoid regexps to be lighter
    i_ = 0
    r = ''
    for i, c in enumerate(value):
        if not c.isupper():
            continue

        r += value[i_:i] + sep + c.lower() \
                if i else c.lower()
        i_ = i+1

    r += value[i_:]
    return r

def camel_to_verbose(value):
    i_ = 0
    r = ''
    for i, c in enumerate(value):
        if not c.isupper():
            continue
        r += value[i_:i] + ' ' + c \
                if i else c
        i_ = i+1

    r += value[i_:]
    return r

def snake_to_verbose(value, sep = '_'):
    """
    Return a human readable version of the given value.
    Underscores are replaced by space, and first letter of
    each word is capitalized.

    The verbose name is automatically translated.
    """
    return _(' '.join([
        word.capitalize() for word in value.split(sep)
    ]))


