import uuid

from django.db import models
from django.db.models import Q
from django.contrib.auth import models as auth
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _

from model_utils.models import TimeStampedModel

from ..perms.models import Context, Accessible, Owned, \
        OwnedQuerySet
from ..ui.components import Component, Slots, Widgets
from ..ui.models import UserWidget
from ..utils.fields import ReferenceField

from .widgets import DeleteActionWidget


class Container(Accessible, Context):
    # POLICY_EVERYONE = 0x00
    # POLICY_ON_REQUEST = 0x01
    # POLICY_ON_INVITE = 0x02
    # POLICY_CHOICES = (
    #    (POLICY_EVERYONE, _('everyone')),
    #    (POLICY_ON_REQUEST, _('on request')),
    #    (POLICY_ON_INVITE, _('on invitation')),
    # )
    # subscription_policy = models.SmallIntegerField(
    #    _('subscription policy'),
    #    choices = POLICY_CHOICES,
    # )
    context = models.ForeignKey(
        Context, on_delete=models.CASCADE,
        blank=True, null=True,
        related_name='children',
    )
    uuid = models.UUIDField(
        db_index=True, unique=True,
        primary_key=True,
        default=uuid.uuid4
    )
    title = models.CharField(
        _('title'), max_length=128
    )
    slug = models.SlugField(
        _('slug'),
        null=True, blank=True,
        max_length=64,
        unique=True,
        help_text=_(
            'Slug is used to generate url to this content. '
            'It can only contain alphanumeric characters and "_-".'
        )
    )
    # TODO: image & cover
    description = models.TextField(
        _('description'),
        blank=True, null=True,
        max_length=256,
    )

    @property
    def service_set(self):
        return Service.objects.context(self)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        return super().save(*args, **kwargs)


class ContentQuerySet(OwnedQuerySet):
    def _get_user_q(self, user):
        if not user.is_anonymous:
            return super()._get_user_q(user) | Q(modifier=user)
        return super()._get_user_q(user)


class Content(Owned, TimeStampedModel):
    """
    Content can be any kind of content created by user and published in
    a Container (or Context).

    Content is a component rendered inside a Container or Service view.
    """
    uuid = models.UUIDField(
        db_index=True, unique=True,
        primary_key=True,
        default=uuid.uuid4
    )
    # modifier read-only field
    modifier = models.ForeignKey(
        auth.User,
        on_delete=models.SET_NULL,
        verbose_name=_('modified by'),
        null=True, blank=True,
        related_name='+',
    )
    text = models.TextField(
        verbose_name=_('text'),
        null=True, blank=True,
    )
    # TODO: text format: raw, markdown, safe html, rst?

    objects = ContentQuerySet.as_manager()

    class Meta:
        ordering = ('-modified',)

    api_base_url = '/content/'

    @property
    def api_detail_url(self):
        return self.api_base_url + str(self.pk) + '/'

    @property
    def is_saved(self):
        # FIXME: not the most sure ever but beyond our possibilities
        return self.modifier is not None

    @classmethod
    def get_component_class(cls):
        from .components import ContentComp
        return ContentComp

    def as_component(self):
        """ Return component that renders self. """
        return self.get_component_class()(object=self)

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
        if not role.user.is_anonymous:
            self.modifier = role.user


class Service(UserWidget):
    """
    A Service offers end-user level's application, that is enabled on a
    per-container level.
    """
    slug = models.SlugField(_('slug'), blank=True, max_length=64)
    view = ReferenceField(_('view'))

    is_default = models.BooleanField(
        _('default'), default=False,
        help_text=_(
            'use this as service shown by default on container'
        )
    )

    icon='fa-align-justify fa'

    def as_view(self):
        """
        Return view instance for this request.
        """
        import inspect
        if inspect.isclass(self.view):
            return self.view.as_view()
        return self.view

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.text)
        super().save(*args, **kwargs)

