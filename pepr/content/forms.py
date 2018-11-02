
from django.forms import ModelForm
from drf_braces.forms.serializer_form import SerializerForm
from pepr.content.models import Content, Container

class ContentForm(ModelForm):
    """
    Content form creation and edition.
    """
    class Meta:
        model = Content
        fields = ['context', 'text', 'access']


class ContainerForm(ModelForm):
    """
    Container form creation and edition.
    """
    class Meta:
        model = Container
        fields = ['title', 'description']

