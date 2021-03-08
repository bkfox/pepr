
class BaseViewMixin:
    template_base = 'pepr/base.html'
    template_embed = 'pepr/base_embed.html'

    def get_context_data(self, **kwargs):
        if not kwargs.get('template_base'):
            if kwargs.pop('embed', None) or self.request.GET.get('embed'):
                kwargs.setdefault('template_base', self.template_embed)
            else:
                kwargs.setdefault('template_base', self.template_base)
        return super().get_context_data(**kwargs)



