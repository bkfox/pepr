import importlib
from django.apps import AppConfig

class ApiAppConfig(AppConfig):
    @classmethod
    def _module_name(cls, post_name=''):
        name = cls.__module__
        name = name[0:max(0, name.rfind('.'))]
        return name + '.' + post_name if post_name else name

    def get_root_routing(self):
        from . import routing
        return routing

    def load_routing(self):
        module_name = self._module_name('routing')
        if not importlib.util.find_spec(module_name):
            return

        module = importlib.import_module(module_name)
        root = self.get_root_routing()

        api_urlpatterns = getattr(module, 'api_urlpatterns', None)
        if api_urlpatterns:
            root.api_urlpatterns += api_urlpatterns

        urlpatterns = getattr(module, 'urlpatterns', None)
        if urlpatterns:
            root.urlpatterns += urlpatterns

        api_multiplex = getattr(module, 'api_multiplex', None)
        if api_multiplex:
            multiplex_class = root.ApiMultiplex
            multiplex_class.consumer_classes.update(api_multiplex)

    def ready(self):
        super().ready()
        self.load_routing()

