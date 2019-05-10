from django import forms

from .models import Subscription


# TODO: field validation => access
class AccessibleForm(forms.ModelForm):
    _role = None

    @property
    def role(self):
        return self._role

    @role.setter
    def role(self, role):
        self._role = role

    @property
    def context(self):
        if self.initial:
            return self.initial.context
        return self.role and self.role.context

    @context.setter
    def context(self, value):
        self.role = value.get_role(self.role.user)

    def __init__(self, role, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.role = role

        # hide context widget
        if 'context' in self.fields:
            context = self.fields['context']
            # FIXME: disabling => problem with serializer when PUT
            # check SO#22124555
            # if self.instance and self.instance.is_saved:
            #    context.disabled = True
            context.widget = forms.HiddenInput()

        if 'access' in self.fields:
            self.fields['access'].help_text = self.get_access_help_text()
            self.limit_access_field()

    def get_access_help_text(self):
        return 'Specify who can access this {model}. Only people with the ' \
               'given access or higher will see it.' \
                .format(model=self._meta.model._meta.verbose_name)

    def limit_access_field(self):
        """ Limit access field's choices. """
        role = self.role
        access = self.fields['access']

        choices = self._meta.model._meta.get_field('access').choices
        access.choices = [access for access in choices
                          if role.has_access(access[0])]

    def save(self):
        raise NotImplemented('save() is not implemented')


OwnedForm = AccessibleForm


class SubscriptionForm(OwnedForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def limit_access_field(self):
        pass



