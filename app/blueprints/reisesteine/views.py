from flask import render_template, Blueprint, g, redirect, request, current_app, abort, url_for

reisesteine = Blueprint('reisesteine', __name__, template_folder='templates', url_prefix='/<lang_code>/')

# multilingual routing logic ************************************
@reisesteine.url_defaults
def add_language_code(endpoint, values):
    values.setdefault('lang_code', g.lang_code)

@reisesteine.url_value_preprocessor
def pull_lang_code(endpoint, values):
    g.lang_code = values.pop('lang_code')

@reisesteine.before_request
def before_request():
    dfl = request.url_rule.defaults
    if 'lang_code' in dfl:
        if dfl['lang_code'] != request.full_path.split('/')[1]:
            abort(404)

@reisesteine.route('/')
def index():
    return render_template('reisesteine/home.html')