import importlib

from django.apps import apps, AppConfig
from django.utils.functional import cached_property
from django.urls import path, include


__all__ = ('discover_urls', 'discover_consumers', 'PeprAppConfig')


def discover_urls(api_prefix='api/'):
    """ Get url patterns from all registered PeprAppConfig. """
    urls, api_urls = [], []

    for app in apps.get_app_configs():
        if isinstance(app, PeprAppConfig) and app.discover_urls:
            if app.urls:
                urls.append(app.urls)
            if app.api_urls:
                api_urls.append(app.api_urls)
    urls.insert(0, path(api_prefix, include(api_urls)))
    return urls


def discover_consumers():
    """ Get consumers from all registered PeprAppConfig. """
    consumers = {}
    for app in apps.get_app_configs():
        if isinstance(app, PeprAppConfig) and app.discover_consumers and \
                app.consumers:
            consumers.update(app.consumers)
    return consumers


class PeprAppConfig(AppConfig):
    """
    Provide extra features for Django application:
    - get urls, api urls, and consumers from ``app.urls`` module.
    - get assets consts from ``app.consts`` module.
    """
    discover_urls = True
    discover_consumers = True
    discover_assets = True

    @cached_property
    def urls_module(self):
        return self.get_module('urls')

    @cached_property
    def urls(self):
        """
        Url patterns as Django's ``path(self.label + '/')``, or None.
        Taken from ``app.urls.urlpatterns``.
        """
        urls = getattr(self.urls_module, 'urlpatterns', None)
        return path(self.label + '/', include(urls)) if urls else None

    @cached_property
    def api_urls(self):
        """
        Api url patterns as Django's ``path(self.label + '/')``, or None.
        Taken from ``app.urls.api_urlpatterns``.
        """
        urls = getattr(self.urls_module, 'api_urlpatterns', None)
        return path(self.label + '/', include(urls)) if urls else None

    @cached_property
    def consumers(self):
        """
        Dict of consumers by name from app's ``urls`` module.
        Names are prefixed with ``app.label + '/'``.
        Taken from ``app.urls.consumers``.
        """
        consumers = getattr(self.urls_module, 'consumers', None)
        return { f'{self.label}/{k}': v for k, v in consumers.items() }

    @cached_property
    def assets_module(self):
        """ Application ``assets`` """
        return self.get_module('assets')

    @cached_property
    def assets_consts(self):
        """ Assets's consts """
        return getattr(self.assets_module, 'consts', None)

    def get_module(self, name=''):
        """ Return application (sub-)module. """
        if not name:
            return self.module

        name = self.module.__name__ + '.' + name
        return importlib.import_module(name) \
            if importlib.util.find_spec(name) else None


