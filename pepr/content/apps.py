from ..apps import PeprAppConfig


class PeprContentConfig(PeprAppConfig):
    name = 'pepr.content'
    label = 'pepr_content'
    url_prefix = 'content'

