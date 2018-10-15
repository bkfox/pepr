import glob
import os

from django_assets import Bundle, register


js = Bundle(
    # vendor
    'vendor/js/jquery.min.js', 'vendor/js/bootstrap.bundle.js',
    'vendor/js/vue.js', 'vendor/js/lodash.js',

    # pepr - core
    'pepr/ui/js/pepr.js',
    'pepr/ui/js/emitter.js', 'pepr/ui/js/request.js',
    'pepr/ui/js/connection.js',

    # pepr - ui
    'pepr/ui/js/collection.js', 'pepr/ui/js/container.js',
    'pepr/ui/js/form.js',
    filters='jsmin', output='gen/packed.js'
)

css = Bundle(
    # vendor
    'vendor/css/fa-regular.css', 'vendor/css/bootstrap.css',
    # pepr/ui
    'pepr/ui/css/pepr.css',
    filters='cssmin', output='gen/packed.css'
)


register('pepr_js', js)
register('pepr_css', css)



