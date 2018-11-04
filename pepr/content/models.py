import uuid
from enum import IntEnum

from django.db import models
from django.db.models import Q
from django.contrib.auth import models as auth
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _
from django.urls import reverse

from pepr.perms.models import Context, AccessibleBase, Owned, \
        OwnedQuerySet
from pepr.ui.views import ComponentMixin, Slots, Widgets
from pepr.ui.models import UserWidget
from pepr.utils.fields import ReferenceField

from .widgets import DeleteActionWidget


class Container(AccessibleBase, Context):
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
    uuid = models.UUIDField(
        db_index=True, unique=True,
        primary_key=True,
        default=uuid.uuid4
    )
    context = models.ForeignKey(
        Context, on_delete=models.CASCADE,
        blank=True, null=True,
        related_name='children',
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
        return super()._get_user_q(user) | Q(mod_by=user)

class Content(Owned):
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
    created_date = models.DateTimeField(
        _('creation date'),
        auto_now_add=True,
        null=True, blank=True,
        help_text=_('date of creation'),
    )
    created_by = models.ForeignKey(
        auth.User,
        on_delete=models.SET_NULL,
        verbose_name=_('created by'),
        null=True, blank=True,
        related_name='+',
    )
    mod_date = models.DateTimeField(
        _('modification date'),
        auto_now=True,
        help_text=_('date of last modification'),
    )
    mod_by = models.ForeignKey(
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
        ordering = ('-mod_date',)

    url_basename = 'content'
    url_prefix = 'content'

    @property
    def is_saved(self):
        return self.mod_date is not None

    @property
    def api_detail_url(self):
        """
        API base url for this object detail.
        """
        return reverse(self.url_basename + '-detail',
                       kwargs={'pk': self.pk})

    @property
    def api_list_url(self):
        """
        API base url for this object detail.
        """
        return reverse(self.url_basename + '-list')

    def as_component(self):
        """ Return component that renders self. """
        from .components import ContentComp
        return ContentComp(object=self)

    def as_data(self):
        """
        Return serialized version of this content instance.
        """
        return self.get_serializer_class()(
            self, # role=self.role
        ).data

    # @classmethod
    # def get_form_view(cl, **init_kwargs):
    #    """
    #    Return form view component instance
    #    """
    #    from pepr.views.content import ContentFormView
    #    return ContentFormView(cl, **init_kwargs)

    @classmethod
    def get_serializer_class(cl):
        """
        Return serializer class used to return content to users.
        """
        from pepr.content.serializers import ContentSerializer
        return ContentSerializer

    def save_by(self, role):
        """
        Update created_by and mod_by based on given user; publish content
        if `publish` is True.
        """
        if not role.user.is_anonymous:
            self.mod_by = role.user
        super().save_by(role)


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
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

