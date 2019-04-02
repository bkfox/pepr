"""
Provides Request interfaces usable from consumers.
"""
class ApiMessage:
    consumer = None

    request_id = 0
    query = None
    data = None

    def __init__(self, consumer, **kwargs):
        self.consumer = consumer
        self.__dict__.update(kwargs)

    def message(self, *args, **kwargs):
        return ApiMessage(self.consumer, request_id=self.request_id,
                          *args, **kwargs)

    def request(self, *args, **kwargs):
        return ApiRequest(self.consumer, request_id=self.request_id,
                          *args, **kwargs)

    def response(self, *args, **kwargs):
        return ApiResponse(self.consumer, request_id=self.request_id,
                           *args, **kwargs)


class ApiRequest(ApiMessage):
    path = None
    method = None

    def __init__(self, consumer, path, **kwargs):
        self.path = path.rstrip('/')
        super().__init__(consumer, **kwargs)


class ApiResponse(ApiMessage):
    status = 200
    errors = None


