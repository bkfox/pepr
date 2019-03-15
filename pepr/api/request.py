"""
Provides Request interfaces usable from consumers.
"""
from urllib.parse import urlparse

from django.http import HttpRequest, QueryDict

from rest_framework import serializers


# TODO:
# - META
# - FILES, body
# - iter & read*


class RouterRequest(HttpRequest):
    """
    Request passed to views when using RouterConsumerBase. This offers a
    similar interface than HttpRequest, but aims to avoid unnecessary
    copies and so on.
    """
    id = 0

    router = None
    """ Router consumer that created this request """
    consumer = None
    """ Consumer instance that can handle the request """

    # Since most of data will stay the same along multiple API requests
    # we can provide theses at the level of the router and avoid extra-
    # data to be copied/duplicated/etc.
    defaults = None

    # We must disable CSRF check in order to be able to use views from
    # WebSockets; security is managed differently in this case. Read
    # Channels' documentation for more details.
    _dont_enforce_csrf_checks = True

    def __init__(self, data):
        # TODO: parse path and clean query parameters from self.path
        self.id = data.get('request_id')
        self.method = data.get('method', 'GET').upper()
        self.path = data.get('path', '')
        self.data = data.get('data', {})
        self.GET = QueryDict(urlparse(self.path).query, mutable=True)

        if self.method not in ('GET', 'HEAD', 'POST', 'PUT', 'DELETE'):
            raise ValueError('invalid method {}'.format(self.method))

        if data.get('query'):
            # FIXME: can values be (list of values or value)? How do we
            #        do both?
            self.GET.update(data['query'])

    def __getattr__(self, attr):
        try:
            return getattr(self.defaults, attr)
        except KeyError:
            return self.__getattribute__(attr)

    def __dir__(self):
        names = super().__dir__()
        names += [name for name in dir(self.defaults)
                  if not name.startswith('__') and name not in names]
        return names

    # HttpRequest overwrites & DRF compatibility
    body = ''
    scheme = 'ws'

    @property
    def POST(self):
        return self.data if self.method == 'POST' else None

    @property
    def PUT(self):
        return self.data if self.method == 'PUT' else None

    @property
    def content_type(self):
        return self.META['CONTENT_TYPE']


class RequestSerializer(serializers.Serializer):
    """
    Serializer for messages transported over the websocket API. This
    class is responsible for the message format, and can be overriden in
    order to implement other formats.

    The save() return type is RouterRequest (or child class).
    """
    request_id = serializers.IntegerField()
    method = serializers.CharField(max_length=12, default='GET')
    path = serializers.CharField(max_length=64)
    status = serializers.IntegerField(required=False)
    query = serializers.DictField(required=False)
    data = serializers.DictField(required=False)

    def create(self, validated_data):
        return RouterRequest(validated_data)

