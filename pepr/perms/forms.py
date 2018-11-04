from django import forms


class AccessibleForm(forms.ModelForm):
    _role = None

    @property
    def role(self):
        return self._role

    @role.setter
    def role(self, role):
        self._role = role

        # limit access choices based on role; get choices from
        # self.model's access field (from self's access fields may
        # lead to erronous values).
        if role:
            access = self.fields['access']
            choices = self._meta.model._meta.get_field('access') \
                                .choices

            access.choices = [access for access in choices
                              if role.has_access(access[0])]

    def __init__(self, *args, role=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.role = role

        if 'context' in self.fields:
            context = self.fields['context']
            if self.instance and self.instance.is_saved:
                context.disabled = True
            context.widget = forms.HiddenInput()


OwnedForm = AccessibleForm

