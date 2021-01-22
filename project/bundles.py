from flask_assets import Bundle

bundles = {
    'css_bundle_backend': Bundle(
        'css/backend.css',
        'css/bootstrap.min.css',
        output='gen/backend.css',
        filters='cssmin'
    ),
    'js_bundle_backend': Bundle(
        'js/ext/jquery-3.3.1.slim.min.js',
        'js/ext/bootstrap.min.js',
        output='gen/backend.js',
        filters='jsmin'
    ),
    'css_bundle': Bundle(
        'css/main.css',
        'css/glightbox.min.css',
        output='gen/main.css',
        filters='cssmin'
    ),
    'js_bundle': Bundle(
        'js/scripts/app.js',
        output='gen/scripts.js',
        filters='jsmin'
    )
}