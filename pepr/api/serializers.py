from rest_framework import serializers

from .message import ApiMessage, ApiRequest, ApiResponse


class ApiMessageSerializer(serializers.Serializer):
    consumer = None
    request_id = serializers.IntegerField()
    query = serializers.DictField(required=False)
    data = serializers.DictField(required=False)

    def __init__(self, *args, consumer=None, **kwargs):
        super().__init__(*args, **kwargs)
        if consumer:
            self.consumer = consumer


class ApiRequestSerializer(ApiMessageSerializer):
    """ Serialize requests from client.  """
    consumer = None
    path = serializers.CharField(max_length=64)
    method = serializers.CharField(max_length=12, default='get')

    def create(self, validated):
        return ApiResponse(self.consumer, **validated)


class ApiResponseSerializer(ApiMessageSerializer):
    """ Serialize requests from client.  """
    consumer = None
    status = serializers.IntegerField()
    errors = serializers.ListField(required=False)

    def create(self, validated):
        return ApiResponse(self.consumer, **validated)


