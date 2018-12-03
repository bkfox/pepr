from importlib import import_module

from django.apps import AppConfig
from rest_framework.routers import DefaultRouter


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
        try:
            module = import_module(self._module_name('urls'))
            if hasattr(module, 'api_urls'):
                api_urls += getattr(module, 'api_urls')
            if hasattr(module, 'consumers_urls'):
                consumers_urls += getattr(module, 'consumers_urls')
            if hasattr(module, 'urlpatterns'):
                urlpatterns += getattr(module, 'urlpatterns')
        except ModuleNotFoundError as e:
            return

    def get_consumers_urls(self):
        """
        Return a list of consumers to register to PeprRouter. They are
        given as Django path.
        """
        return []

    def init_consumers_urls(self):
        """ Initialize consumers api url """
        from pepr.consumers import PeprRouter
        for consumer in self.get_consumers_urls():
            PeprRouter.register(consumer)

    def ready(self):
        self.load_urls()


