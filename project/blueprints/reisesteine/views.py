from flask import render_template, Blueprint, g, redirect, request, current_app, abort, url_for
from project.blueprints.reisesteine.forms import NeuerSteinFormular
from project import db
from project.models import Gestein, Stein, Person
from werkzeug.utils import secure_filename

import os

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

@reisesteine.route('/neuerStein', methods=['GET', 'POST'])
def neuerStein():
    form = NeuerSteinFormular()

    if form.validate_on_submit():
        # get or create absender
        absender = Person.query.filter_by(email = form.email.data).first()
        if absender is None:
            absender = Person(vorname = form.vorname.data, nachname = form.nachname.data, email = form.email.data)
        
        # get or create gestein
        gestein = Gestein.query.filter_by(name = form.gestein.data).first()
        if gestein is None:
            gestein = Gestein(name = form.gestein.data)

        fn_stein = ""
        fn_her = ""
        f_stein = form.bild_stein.data
        if f_stein:
            fn_stein = unique_filename('img/steine', secure_filename(f_stein.filename))
            f_stein.save(os.path.join(current_app.static_folder, 'img/steine', fn_stein))

        f_her = form.bild_herkunft.data
        if f_her:
            fn_her = unique_filename('img/steine', secure_filename(f_her.filename))
            f_her.save(os.path.join(current_app.static_folder, 'img/steine', fn_her))


        # create stein
        stein = Stein(  gestein = gestein,
                        herkunft = form.herkunft.data,
                        longitude = form.longitude.data,
                        latitude = form.latitude.data,
                        titel = form.titel.data,
                        pers_geschichte = form.pers_geschichte.data,
                        geo_geschichte = form.geo_geschichte.data,
                        bild_stein = fn_stein,
                        bild_herkunft = fn_her,
                        absender_id = absender,
                        published = False)
        
        # db.session.add(stein)
        # db.session.commit()
        print(stein)
        print(gestein)
        print(absender)

        return redirect(url_for('reisesteine.index'))

    return render_template('reisesteine/neuerStein.html', form=form)


def unique_filename(folder, filename):
    output_filename, file_extension = os.path.splitext(filename)
    n = ''
    while os.path.exists(os.path.join(current_app.static_folder, folder, f'{output_filename}{n}{file_extension}')):
        if isinstance(n, str):
            n = -1
        n += 1
    return f'{output_filename}{n}{file_extension}'