import importlib
from django.apps import AppConfig


class PeprAppConfig(AppConfig):
    """
    Provide basis utilities for applications.
    """
    @classmethod
    def _module_name(cls, post_name=''):
        name = cls.__module__
        name = name[0:max(0, name.rfind('.'))]
        return name + '.' + post_name if post_name else name

    def load_urls(self):
        from pepr.urls import api_urls, consumers_urls, urlpatterns

        module_name = self._module_name('urls')
        if importlib.util.find_spec(module_name):
            module = importlib.import_module(module_name)
            if hasattr(module, 'api_urls'):
                api_urls += getattr(module, 'api_urls')
            if hasattr(module, 'consumers_urls'):
                consumers_urls += getattr(module, 'consumers_urls')
            if hasattr(module, 'urlpatterns'):
                urlpatterns += getattr(module, 'urlpatterns')

    def ready(self):
        self.load_urls()


