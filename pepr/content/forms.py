from pepr.perms.forms import OwnedForm
from .models import Content, Container

from .serializers import ContentSerializer


class ContentForm(OwnedForm):
    """
    Content form creation and edition.
    """
    class Meta:
        model = Content
        fields = ['context', 'text', 'access']


class ContainerForm(OwnedForm):
    """
    Container form creation and edition.
    """
    class Meta:
        model = Container
        fields = ['title', 'description', 'access']

