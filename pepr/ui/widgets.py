
from .views import Widget


class ActionWidget(Widget):
    template_name = 'pepr/ui/action_widget.html'

    hidden_fields = None
    title= ''
    action = ''
    method = 'POST'
    button_class='btn-xs btn-light'
    icon=None

    def get_action(self):
        """ Return action formatted with ``this=self``. """
        return self.action.format(this=self)

    def get_title(self):
        """ Return title formatted with ``this=self``. """
        return self.title.format(this=self)

