from django import forms

from ..core.forms import OwnedForm
from .models import Content, Container


class ContentForm(OwnedForm):
    """
    Content form creation and edition.
    """
    class Meta:
        model = Content
        fields = ['context', 'access', 'owner', 'text']


class ContainerForm(OwnedForm):
    """
    Container form creation and edition.
    """
    class Meta:
        model = Container
        fields = ['title', 'description', 'access']


