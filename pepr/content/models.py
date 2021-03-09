from django.db import models
from django.contrib.auth import models as auth
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _

from model_utils.managers import InheritanceQuerySetMixin
from model_utils.models import TimeStampedModel
from rest_framework.reverse import reverse


from ..core.models import Context, Accessible, Owned, OwnedQuerySet


__all__ = ('Container', 'ContentQuerySet', 'Content', 'Service', 'StreamService')


# TODO:
# - Container
#   - unique slug generation
#   - 
class Container(Context):
    """ Context on which content can be published. """
    slug = models.SlugField(
        _('Slug name'),
        null=True, blank=True,
        max_length=64,
        unique=True,
        help_text=_('Used to generate the url of the page')
    )
    # TODO: image & cover
    description = models.TextField(
        _('Description'),
        blank=True, null=True,
        max_length=256,
    )

    #@property
    #def service_set(self):
    #    return Service.objects.context(self)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        return super().save(*args, **kwargs)


class ContentQuerySet(InheritanceQuerySetMixin, OwnedQuerySet):
    def get_identity_q(self, identity):
        if identity:
            return super().get_identity_q(identity) | models.Q(modifier=identity)
        return super().get_identity_q(identity)


class Content(Owned, TimeStampedModel):
    """ Content published by users. """
    # modifier read-only field
    modifier = models.ForeignKey(
        Context,
        on_delete=models.SET_NULL,
        verbose_name=_('modified by'),
        null=True, blank=True,
        related_name='+',
    )
    text = models.TextField(
        verbose_name=_('text'),
        null=True, blank=True,
    )

    objects = ContentQuerySet.as_manager()

    class Meta:
        ordering = ('-modified',)

    api_basename = 'content'
    template_name = 'pepr/content/content.html'
    form_template_name = 'pepr/content/content_form.html'

    def get_api_url(self, url_name='', *args, **kwargs):
        """ Reverse api url for this model """
        url_name = '{}-{}'.format(self.api_basename, url_name)
        return reverse(url_name, *args, **kwargs)

    @property
    def api_list_url(self):
        """ Get list url for this object's model """
        return self.get_api_url('list')

    @property
    def api_detail_url(self):
        """ Get detail url for this object """
        return self.get_api_url('detail', kwargs={'pk': str(self.pk)})

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

    def save_by(self, role):
        super().save_by(role)
        # `modifier` must be updated to the given role's user. we do it
        # after cauz' there is no need to do it before.
        if not role.is_anonymous:
            self.modifier = role.identity


class Service(Accessible):
    """
    Service offers end-user level application at context level.
    """
    title = models.CharField(_('Title'), max_length=128, blank=True, null=True)
    enabled = models.BooleanField(_('Enabled'), default=True)

    class Meta:
        abstract = True


class StreamService(Service):
    pass

