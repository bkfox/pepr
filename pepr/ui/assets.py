"""
Declare different assets bundles used by applications; as instance of
``django_assets.Bundle``:
- ``vendor_js``, ``vendor_css``: third parties and libraries' assets;
- ``pepr_js``, ``pepr_css``: pepr's assets;
- ``extra_js``, ``extra_css``: assets for anything else;
"""

from django_assets import Bundle, register

#
# Vendors' assets
#
vendor_js = Bundle(
    'vendor/js/vue.js',
    'vendor/js/polyfill.js', 'vendor/js/bootstrap-vue.js',
    'vendor/js/vue-moment.js',
    'vendor/js/lodash.js',
    filters='jsmin', output='gen/vendor.packed.js'
)

vendor_css = Bundle(
    'vendor/css/fa-solid.css', 'vendor/css/fa-regular.css',
    'vendor/css/fontawesome.css',
    'vendor/css/bootstrap.css',
    'vendor/css/bootstrap-vue.css',
    filters='cssmin', output='gen/vendor.packed.css'
)

register('vendor_js', vendor_js)
register('vendor_css', vendor_css)


#
# Pepr assets
#
pepr_js = Bundle(
    # core
    'pepr/ui/js/pepr.js',
    'pepr/ui/js/emitter.js', 'pepr/ui/js/request.js',
    'pepr/ui/js/connection.js', 'pepr/ui/js/cursor.js',

    # ui
    'pepr/ui/js/collection.js',
    'pepr/ui/js/container.js',
    'pepr/ui/js/selector.js',
    'pepr/ui/js/components.js',
    filters='jsmin', output='gen/pepr.packed.js'
)

pepr_css = Bundle(
    # pepr/ui
    'pepr/ui/css/pepr.css',
    filters='cssmin', output='gen/pepr.packed.css'
)
register('pepr_js', pepr_js)
register('pepr_css', pepr_css)

#
# Extra assets
#
extra_js = Bundle(
    filters='jsmin', output='gen/extra.packed.js'
)

extra_css = Bundle(
    filters='cssmin', output='gen/extra.packed.css'
)

register('extra_js', extra_js)
register('extra_css', extra_css)

