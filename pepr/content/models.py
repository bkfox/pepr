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

from pepr.perms.models import Context, Accessible, AccessibleQuerySet
from pepr.ui.views import ComponentMixin
from pepr.ui.models import Widget, WidgetQuerySet
from pepr.utils.functional import cached_result
from pepr.utils.opts import Opts, OptableModel
from pepr.utils.date import format_date


# TODO: check django-autoslug if it is still maintained, and think of
# using it if so.
class Titled(models.Model):
    """
    Utility class in order to have a title and a slug.
    """
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

    class Meta:
        abstract = True

    def update_slug(self):
        self.slug = slugify(self.title)[:64]
        # TODO: unique

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        return super().save(*args, **kwargs)


class ContentBase(OptableModel,Accessible):
    uuid = models.UUIDField(
        db_index =True,
        default=uuid.uuid4
    )

    class Meta:
        abstract = True

    @classmethod
    def api_name(cl):
        return cl._meta.db_table


class Container(Context,ContentBase,Titled):
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

    # TODO: image & cover
    description = models.TextField(
        _('description'),
        blank = True, null = True,
        max_length = 256,
    )

    @classmethod
    def get_edit_view(cl):
        pass


Container._meta.get_field('context').null = True
Container._meta.get_field('context').blank = True


class Content(ContentBase,ComponentMixin):
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

    @classmethod
    def get_template(cl, edit = False, **kwargs):
        return super().get_template(template_name = 'edit_template_name') \
                if edit else \
                super().get_template()


class Service(ContentBase,ComponentMixin):
    # TODO/FIXME:
    # - widgets inclusion into container menus & sidebars
    # - providing new content types
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

    class Options(Opts):
        type = 'channel'
        icon = 'fa-stream'

#    class Meta:
#        unique_together = ('context','slug')

    def get_queryset(self, user, queryset = None):
        """
        Return a queryset of Content objects
        """
        queryset = self.queryset if queryset is None else queryset
        return queryset.for_user(user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object_list'] = self.get_queryset(**kwargs)
        return context


