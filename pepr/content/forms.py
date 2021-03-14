from django import forms

from pepr.core.forms import OwnedForm
from .models import Content


class ContentForm(OwnedForm):
    """
    Content form creation and edition.
    """
    class Meta:
        model = Content
        fields = ['context', 'access', 'owner', 'text']


