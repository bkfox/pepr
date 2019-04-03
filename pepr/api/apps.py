import importlib
from django.apps import AppConfig

class ApiAppConfig(AppConfig):
    @classmethod
    def get_module_name(cls, post_name=''):
        name = cls.__module__
        name = name[0:max(0, name.rfind('.'))]
        return name + '.' + post_name if post_name else name

    def get_project_routing(self):
        """
        Return `routing` module used to store discovered routes.
        By default it MUST follows the way
        """
        from . import routing
        return routing

    @classmethod
    def get_module(self, name=None, post_name=''):
        name = name if name else self.get_module_name(post_name)
        return importlib.import_module(name) \
            if importlib.util.find_spec(name) else None

    def load_routing(self):
        module = self.get_module(post_name='routing')
        if not module:
            return

        routing = self.get_project_routing()
        api_urlpatterns = getattr(module, 'api_urlpatterns', None)
        if api_urlpatterns:
            routing.api_urlpatterns += api_urlpatterns

        urlpatterns = getattr(module, 'urlpatterns', None)
        if urlpatterns:
            routing.urlpatterns += urlpatterns

        api_multiplex = getattr(module, 'api_multiplex', None)
        if api_multiplex:
            routing.route_consumers(api_multiplex)

    def ready(self):
        super().ready()
        self.load_routing()

