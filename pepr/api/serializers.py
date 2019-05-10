from rest_framework import serializers

from .message import ApiMessage, ApiRequest, ApiResponse


__all__ = ['ApiMessageSerializer', 'ApiRequestSerializer',
           'ApiResponseSerializer']


class ApiMessageSerializer(serializers.Serializer):
    consumer = None
    message_class = ApiMessage

    request_id = serializers.IntegerField()
    query = serializers.DictField(required=False)
    data = serializers.DictField(required=False)

    def __init__(self, *args, consumer=None, **kwargs):
        super().__init__(*args, **kwargs)
        if consumer:
            self.consumer = consumer

    def create(self, validated):
        """ Create a message instance with validated data. """
        return self.message_class(self.consumer, **validated)


class ApiRequestSerializer(ApiMessageSerializer):
    """ Serialize requests from client.  """
    consumer = None
    message_class = ApiRequest

    method = serializers.CharField(max_length=12, default='get')
    path = serializers.CharField(max_length=64)


class ApiResponseSerializer(ApiMessageSerializer):
    """ Serialize requests from client.  """
    consumer = None
    message_class = ApiResponse

    status = serializers.IntegerField()
    errors = serializers.ListField(required=False)


