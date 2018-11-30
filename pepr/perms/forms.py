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

    @property
    def context(self):
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

        # custom access help_text
        if 'access' in self.fields:
            access = self.fields['access']
            access.help_text = self.get_access_help_text()

    def get_access_help_text(self):
        return 'Defines which users of the {} have access to this {} ' \
                '(only people with given role or higher will get ' \
                'access)' \
                .format(self.context._meta.verbose_name,
                        self._meta.model._meta.verbose_name)

    def save(self, commit=True):
        self.instance.save_by(self.role)
        super().save(commit)


OwnedForm = AccessibleForm
SubscriptionForm = OwnedForm

