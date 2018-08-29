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
    def get_template(cl, template_name = None, **kwargs):
        """
        Return Template instance to be used to render the component.
        It can be either a class or an instance method.

        By default, it is a class method whose result is cached.

        :py:param str|None template_name: use this `template_name` \
                instead of class's one.
        :py:param \**kwargs: extra arguments passed to render
        """
        template_name = template_name or cl.template_name
        return loader.get_template(template_name) \
                if isinstance(template_name, str) else \
                    loader.select_template(template_name)

    def render_to_string(self, request, **kwargs):
        """
        Render the component into a string (called by render).

        :py:param django.http.Request http request
        :py:param \**kwargs: arguments passed to `get_template` and \
                `get_context_data`
        """
        context = self.get_context_data(**kwargs)
        if context is None:
            return ''
        return self.get_template(**kwargs).render(context)

    def render(self, request, super_view = None, *args, **kwargs):
        """
        Render ComponentMixin into a string and return it

        :py:param django.http.Request http request
        :py:param View super_view: containing view rendering this \
                component
        :py:param \**kwargs: arguments passed to `get_template` and \
                `get_context_data`
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


