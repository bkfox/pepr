from django.shortcuts import render
from django.template import loader, Template, Context
from django.views.generic.base import \
        ContextMixin, TemplateResponseMixin, TemplateView


class ComponentMixin(TemplateResponseMixin,ContextMixin):
    """
    Mixin that allows to render items into string in order to be used
    directly inside other views.
    """
    # FIXME:
    # - is using a list compatible with TemplateView? Might need to
    #   check in order to update ComponentView
    template_name = ''
    """
    Name of the template to load from `get_template` can be a list of/a
    single string.
    """
    request = None
    super_view = None
    kwargs = None

    @classmethod
    def get_template(cl):
        """
        Return Template instance to be used to render the component.
        It can be either a class or an instance method.

        By default, it is a class method whose result is cached.
        """
        return loader.get_template(cl.template_name) \
                if isinstance(cl.template_name, str) else \
                    loader.select_template(cl.template_name)

    def render_to_string(self, request, *args, **kwargs):
        """
        Render the component into a string (called by render).
        """
        context = self.get_context_data(**kwargs)
        if context is None:
            return ''
        return self.get_template().render(context)

    def render(self, request, super_view = None, *args, **kwargs):
        """
        Render ComponentMixin into a string and return it
        """
        self.request = request
        self.super_view = super_view
        self.kwargs = kwargs
        return self.render_to_string(request, *args, **kwargs)


class ComponentView(TemplateView,ComponentMixin):
    """
    Make component usable as a view
    """
    pass


