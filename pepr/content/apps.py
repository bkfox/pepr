from django.apps import AppConfig

class PeprContentConfig(AppConfig):
    name = 'pepr.content'
    label = 'pepr_content'

    def ready(self):
        from pepr.ui import assets

        assets.pepr_js.contents += (
            'pepr/content/js/content.js',
        )


