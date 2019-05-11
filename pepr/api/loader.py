import importlib
from types import ModuleType

from django.apps import apps
from django.urls import path, include


def get_module(app, postfix=''):
    """
    Return a module for the given app
    """
    if not postfix:
        return app.module

    name = app.module.__name__ + '.' + postfix
    return importlib.import_module(name) \
        if importlib.util.find_spec(name) else None


class Loader:
    api_url_prefix = '/api'
    """ Url prefix for api views. """
    api_urlpatterns = None
    """ Discovered urlpatterns for api views """
    urlpatterns = None
    """ Discovered urlpatterns for regular views. """
    multiplex_class = None
    """ MultiplexConsumer class used to register consumers to.  """

    consts = {}

    def __init__(self, load=False, multiplex_class=None, **kwargs):
        self.__dict__.update(kwargs)
        self.multiplex_class = multiplex_class
        if load:
            self.load()

    @property
    def urls(self):
        """
        Return array of url patterns registered using this router.
        """
        self.load()
        return [
            path('api/', include(self.api_urlpatterns), name='api'),
        ] + self.urlpatterns

    def route_consumers(self, consumer_classes):
        """
        Add given consumers to the `MultiplexConsumer` class used as
        instance's multiplexer.
        :param {"consumer_path":Consumer} consumer_classes: consumer \
               classes to register.
        """
        self.multiplex_class.consumer_classes.update(consumer_classes)

    def load(self, force=None):
        if self.urlpatterns is not None and not force:
            return
        self.api_urlpatterns = []
        self.urlpatterns = []
        self.consts = {}
        for app in apps.get_app_configs():
            self.load_app(app)

    def load_app(self, app):
        self.load_app_routing(app)
        self.load_app_consts(app)

    def load_app_routing(self, app):
        module = get_module(app, 'routing')
        if not module:
            return

        self.api_urlpatterns += getattr(module, 'api_urlpatterns', [])
        self.urlpatterns += getattr(module, 'urlpatterns', [])

        if self.multiplex_class is not None:
            api_multiplex = getattr(module, 'api_multiplex', None)
            if api_multiplex:
                self.route_consumers(api_multiplex)

    def _merge_consts(self, path, source, dest):
        for key in path.split('.'):
            dest[key] = dest.setdefault(key, {})
            dest = dest[key]
        dest.update({k: v() if callable(v) else v
                     for k, v in source.items()})

    def load_app_consts(self, app):
        module = get_module(app, 'consts')
        if not module:
            return

        consts = {k: getattr(module, k) for k in dir(module)
                  if not k.startswith('_') and
                  not isinstance(getattr(module, k), ModuleType)}
        self._merge_consts(app.name, consts, self.consts)

