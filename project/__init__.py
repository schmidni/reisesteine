from flask import Flask, request, g, redirect, url_for, render_template, send_from_directory
from flask_babel import Babel
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
import logging
import os

from logging.handlers import RotatingFileHandler

from project.bundles import bundles

from flask_assets import Environment

app = Flask(__name__)
app.config.from_object(Config)

# Set up logger
if not app.debug:
    if not os.path.exists('logs'): 
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/portfolio.log', maxBytes=10240,
                                       backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)

    app.logger.setLevel(logging.INFO)
    app.logger.info('Portfolio startup')

# init mail
mail = Mail(app)

# database
db = SQLAlchemy(app)
migrate = Migrate(app, db)
from project import models

# import and register blueprints
from project.blueprints.reisesteine import reisesteine
app.register_blueprint(reisesteine)

assets = Environment(app)

# register static bundles
assets.register('js_bundle', bundles['js_bundle'])
assets.register('js_bundle_backend', bundles['js_bundle_backend'])
assets.register('css_bundle', bundles['css_bundle'])
assets.register('css_bundle_backend', bundles['css_bundle_backend'])

# set up babel
babel = Babel(app)
@babel.localeselector
def get_locale():
    if not g.get('lang_code', None):
        g.lang_code = request.accept_languages.best_match(app.config['LANGUAGES'])
    if not g.get('lang_code', None):
        g.lang_code = 'de'
    return g.lang_code

# route if no lang code is specified
@app.route('/')
def home():
    g.lang_code = request.accept_languages.best_match(app.config['LANGUAGES'])
    if not g.get('lang_code', None):
        g.lang_code = 'de'
    return redirect(url_for('reisesteine.index', lang_code=g.lang_code))

# cert bot challenge
@app.route('/.well-known/acme-challenge/<path:path>')
def cert_bot_challenge(path):
    return send_from_directory('{}/.well-known/acme-challenge'.format(os.path.dirname(app.instance_path)), path)

# 404
@app.errorhandler(404)
def not_found_error(error):
    g.lang_code = request.accept_languages.best_match(app.config['LANGUAGES'])
    if not g.get('lang_code', None):
        g.lang_code = 'de'
    return render_template('404.html'), 404
