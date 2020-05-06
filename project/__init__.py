from flask import Flask, request, g, redirect, url_for, render_template
from flask_babel import Babel
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

import logging
import os

from logging.handlers import RotatingFileHandler

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

# database
db = SQLAlchemy(app)
migrate = Migrate(app, db)
from project import models

# import and register blueprints
from project.blueprints.reisesteine import reisesteine
app.register_blueprint(reisesteine)

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

# 404
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404
