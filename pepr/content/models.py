import uuid
from enum import IntEnum

from django.db import models
from django.db.models import Q
from django.contrib.auth import models as auth
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _

from pepr.perms.models import Context, Accessible, AccessibleQuerySet
from pepr.ui.views import ComponentMixin
from pepr.utils.fields import ReferenceField


class ContainerItem(Accessible):
    uuid = models.UUIDField(
        db_index=True, unique=True,
        primary_key=True,
        default=uuid.uuid4
    )

    class Meta:
        abstract = True


class Container(ContainerItem, Context):
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

# overwrites default Accessible's "context" field in order to make it
# optionable. This allows to use the same base class (`Container`) for
# both root Container, and sub-Containers.
Container._meta.get_field('context').null = True
Container._meta.get_field('context').blank = True


class ContentQuerySet(AccessibleQuerySet):
    def user(self, user):
        # we need to overwrite default `user` method in order to ensure
        # that the author of some Content has always access to it.
        q = self.get_user_q(user)
        if not user.is_anonymous:
            q |= Q(created_by=user) | Q(mod_by=user)
        return self.filter(q).distinct()


class Content(ContainerItem, ComponentMixin):
    """
    Content can be any kind of content created by user in a Container (or
    Context).

    Content is a component rendered inside a Container or Service view.
    """
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

    template_name = 'pepr/content/content.html'

    objects = ContentQuerySet.as_manager()

    class Meta:
        ordering = ('-mod_date',)

    #@classmethod
    #def get_form_view(cl, **init_kwargs):
    #    """
    #    Return form view component instance
    #    """
    #    from pepr.views.content import ContentFormView
    #    return ContentFormView(cl, **init_kwargs)

    def update_by(self, user):
        """
        Update created_by and mod_by based on given user; publish content
        if `publish` is True.
        """
        if not self.created_by:
            self.created_by = user
        self.mod_by = user

    @classmethod
    def get_serializer_class(cl):
        """
        Return serializer class used to return content to users.
        """
        from pepr.content.serializers import ContentSerializer
        return ContentSerializer


class Service(ContainerItem):
    """
    A Service offers end-user level's application, that is enabled on a
    per-container level.
    """
    title = models.CharField(_('title'), max_length=64)
    slug = models.SlugField(_('slug'), max_length=64)
    view = ReferenceField(_('view'))

    in_menu = models.BooleanField(
        _('in menu'), default=True,
    )
    is_enabled = models.BooleanField(
        _('enabled'), default=False,
    )
    is_default = models.BooleanField(
        _('default'), default=False,
        help_text=_(
            'use this as service shown by default on container'
        )
    )

    icon='fa-align-justify fas'

    class Meta:
        unique_together = ('slug', 'context')

    def get_view(self):
        """
        Return view instance for this request.
        """
        import inspect
        if inspect.isclass(self.view):
            return self.view.as_view()
        return self.view

