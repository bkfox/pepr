from django.db import models
from django.utils.translation import ugettext_lazy as _

from model_utils.managers import InheritanceQuerySetMixin
from model_utils.models import TimeStampedModel
from rest_framework.reverse import reverse

from pepr.core import models as core


__all__ = ('Container', 'ContentQuerySet', 'Content', 'ContentService')


class Container(core.Context):
    """ Context for content. """
    headline = models.CharField(
        _('Headline'), max_length=128,
        blank=True, null=True
    )

    basename = 'container'


class ContentQuerySet(InheritanceQuerySetMixin, core.OwnedQuerySet):
    def get_identity_q(self, identity):
        if identity:
            return super().get_identity_q(identity) | models.Q(modifier=identity)
        return super().get_identity_q(identity)


class Content(core.Owned, TimeStampedModel):
    """ Content published by users. """
    # modifier read-only field
    modifier = models.ForeignKey(
        # TODO: filter is_identity
        core.Context,
        limit_choices_to=core.ContextQuerySet.get_identities_q(),
        on_delete=models.SET_NULL,
        verbose_name=_('modified by'),
        null=True, blank=True,
        related_name='+',
    )
    text = models.TextField(
        verbose_name=_('text'),
        null=True, blank=True,
    )

    basename = 'content'
    objects = ContentQuerySet.as_manager()

    class Meta:
        ordering = ('-modified',)

    api_basename = 'content'
    template_name = 'pepr_content/content.html'
    form_template_name = 'pepr_content/content_form.html'

    def get_component_class(self):
        from .components import Component
        return Component

    def as_component(self, component_class=None, **kwargs):
        """ Return component rendering content instance. """
        comp_class = component_class or self.get_component_class()
        kwargs.setdefault('template_name', self.template_name)
        kwargs.setdefault('object', self)
        return comp_class(template_name=self.template_name, object=self)

    def get_component_form_class(self):
        from .components import ContentFormComp
        return ContentFormComp

    def as_component_form(self, **kwargs):
        """ Return component rendering content instance. """
        if not 'component_class' in kwargs:
            kwargs['component_class'] = self.get_component_form_class()
        if not 'template_name' in kwargs:
            kwargs['template_name'] = self.form_template_name
        return self.as_component(**kwargs)

    @classmethod
    def get_serializer_class(cl):
        """
        Return serializer class used to return content to users. This
        method is necessary in order to correctly render objects from
        the observer consumers.
        """
        from .serializers import ContentSerializer
        return ContentSerializer

    def get_serializer(self, serializer_class=None, **kwargs):
        ser_class = serializer_class or self.get_serializer_class()
        return ser_class(self, **kwargs)

    def save_by(self, role):
        super().save_by(role)
        # `modifier` must be updated to the given role's user. we do it
        # after cauz' there is no need to do it before.
        if not role.is_anonymous:
            self.modifier = role.identity


class ContentService(core.Service):
    """ Service handling content (list & detail) display. """
    service_url_name = 'content-list'
    # basename='content_list'


