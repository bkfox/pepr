import uuid
from enum import IntEnum

from django.db import models
from django.contrib.auth import models as auth
from django.http import Http404, HttpResponse
from django.urls import NoReverseMatch, reverse
from django.utils import timezone as tz
from django.utils.functional import cached_property
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _

from model_utils.managers import InheritanceManager, \
        InheritanceQuerySetMixin

from pepr.perms.models import Context, Accessible, AccessibleQuerySet
from pepr.ui.views import ComponentMixin
from pepr.ui.models import Widget, WidgetQuerySet
from pepr.utils.functional import cached_result
from pepr.utils.opts import Opts, OptableModel
from pepr.utils.date import format_date


class ContainerItemQuerySet(InheritanceQuerySetMixin,AccessibleQuerySet):
    pass


class ContainerItem(OptableModel,Accessible):
    uuid = models.UUIDField(
        db_index = True, unique = True,
        primary_key = True,
        default=uuid.uuid4
    )

    objects = ContainerItemQuerySet.as_manager()

    class Meta:
        abstract = True


class Container(ContainerItem,Context):
    #POLICY_EVERYONE = 0x00
    #POLICY_ON_REQUEST = 0x01
    #POLICY_ON_INVITE = 0x02
    #POLICY_CHOICES = (
    #    (POLICY_EVERYONE, _('everyone')),
    #    (POLICY_ON_REQUEST, _('on request')),
    #    (POLICY_ON_INVITE, _('on invitation')),
    #)
    # subscription_policy = models.SmallIntegerField(
    #    _('subscription policy'),
    #    choices = POLICY_CHOICES,
    #)
    uuid = models.UUIDField(
        db_index = True, unique = True,
        primary_key = True,
        default=uuid.uuid4
    )
    title = models.CharField(
        _('title'), max_length = 128
    )
    slug = models.SlugField(
        _('slug'),
        null = True, blank = True,
        max_length = 64,
        unique = True,
        help_text = _(
            'Slug is used to generate url to this content. '
            'It can only contain alphanumeric characters and "_-".'
        )
    )
    # TODO: image & cover
    description = models.TextField(
        _('description'),
        blank = True, null = True,
        max_length = 256,
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        return super().save(*args, **kwargs)


Container._meta.get_field('context').null = True
Container._meta.get_field('context').blank = True


class Content(ContainerItem,ComponentMixin):
    """
    Content is the actual content created by user. It is a component
    rendered by a channel.
    """
    created_date = models.DateTimeField(
        _('creation date'),
        auto_now_add = True,
        null = True, blank = True,
        help_text = _('date of creation'),
    )
    created_by = models.ForeignKey(
        auth.User,
        on_delete = models.SET_NULL,
        verbose_name = _('created by'),
        null = True, blank = True,
        related_name='+',
    )
    mod_date = models.DateTimeField(
        _('modification date'),
        auto_now = True,
        help_text = _('date of last modification'),
    )
    mod_by = models.ForeignKey(
        auth.User,
        on_delete = models.SET_NULL,
        verbose_name = _('modified by'),
        null = True, blank = True,
        related_name='+',
    )
    text = models.TextField(
        verbose_name = _('text'),
        null = True, blank = True,
    )
    # TODO: text format: raw, markdown, safe html, rst?

    edit_template_name = 'pepr/content/content_edit.html'
    template_name = 'pepr/content/content.html'

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

    def get_template(self):
        edit = self.kwargs.get('edit') or False
        return super().get_template(template_name = 'edit_template_name') \
                if edit else super().get_template()

    @classmethod
    def get_serializer_class(cl):
        from pepr.content.serializers import ContentSerializer
        return ContentSerializer


class Service(ContainerItem,ComponentMixin):
    # TODO/FIXME:
    # - widgets inclusion into container menus & sidebars
    is_enabled = models.BooleanField(
        _('enabled'),
        default = False,
    )
    is_default = models.BooleanField(
        _('default'),
        default = False,
        help_text = _(
            'use this as service shown by default on container'
        )
    )

    queryset = Content.objects.all()
    template_name = 'pepr/content/service.html'

    def get_queryset(self):
        """
        Return a queryset of Content objects
        """
        return self.queryset.user(self.request.user) \
                   .select_subclasses()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object_list'] = self.get_queryset()
        return context


