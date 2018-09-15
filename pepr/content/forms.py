
from django.forms import ModelForm
from drf_braces.forms.serializer_form import SerializerForm
from pepr.content.models import Content

class ContentForm(ModelForm):
    class Meta:
        model = Content
        fields = ['context', 'text','access']



