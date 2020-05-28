from flask import jsonify, render_template, Blueprint, g, redirect, request, current_app, abort, url_for
from project.blueprints.reisesteine.forms import editSteinForm
from project import db
from project.models import Gestein, Stein, Person
from werkzeug.utils import secure_filename

from PIL import Image

import requests
import urllib.request
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

@reisesteine.route('/listSteine')
def listSteine():
    steine = Stein.query.all()
    return render_template('reisesteine/backend/listSteine.html', steine=steine)

@reisesteine.route('/deleteStein/<id>')
def deleteStein(id):
    Stein.query.filter_by(id=id).delete()
    db.session.commit()
    return redirect(url_for('reisesteine.listSteine'))

@reisesteine.route('/newStein', methods=['POST'])
def newStein():
    f_email = request.form.get('email')
    f_gestein = request.form.get('gestein')

    email = Person.query.filter_by(email=f_email).first()
    gestein = Gestein.query.filter_by(name=f_gestein).first()

    email = f_email if not email else email.id
    gestein = f_gestein if not gestein else gestein.id

    return redirect(url_for('reisesteine.editStein', email=email, gestein=gestein))

@reisesteine.route('/editStein/<id>', methods=['GET', 'POST'])
@reisesteine.route('/editStein', defaults={'id': None}, methods=['GET', 'POST'])
def editStein(id):
    form = editSteinForm()

    if form.validate_on_submit():

        # get or create absender
        absender = Person.get_or_create(id = form.user_id.data)
        absender.update(**form.data)

        # get or create gestein
        gestein = Gestein.get_or_create(id = form.gestein_id.data)
        gestein.name = form.gestein.data

        fn_stein, fn_her = "", ""
        f_stein = form.bild_stein.data
        if f_stein:
            fn_stein = unique_filename('img/steine', secure_filename(f_stein.filename))
            f_stein.save(os.path.join(current_app.static_folder, 'img/steine', fn_stein))

        f_her = form.bild_herkunft.data
        if f_her:
            fn_her = unique_filename('img/steine', secure_filename(f_her.filename))
            f_her.save(os.path.join(current_app.static_folder, 'img/steine', fn_her))

        with Image.open(os.path.join(current_app.static_folder, 'img/steine', fn_stein)) as img:
            width, height = img.size
        optimize_image(os.path.join('img/steine', fn_stein), min(width, 1000))
        with Image.open(os.path.join(current_app.static_folder, 'img/steine', fn_stein)) as img:
            width, height = img.size
        optimize_image(os.path.join('img/steine', fn_her), min(width, 1980))

        # get or create stein
        stein = Stein.get_or_create(id=form.stein_id.data)

        # assign
        stein.populate(form)
        stein.bild_stein = fn_stein
        stein.bild_herkunft = fn_her
        stein.absender = absender
        stein.gesteinsart = gestein

        db.session.add(stein)
        db.session.commit()
        return redirect(url_for('reisesteine.listSteine'))

    # edit an existing rock
    if id is not None:
        curr_stein = Stein.query.get(id)
        form.populate(curr_stein)

    # new rock, fill in Absender
    if request.args.get('email'):
        a = Person.query.get(request.args.get('email'))
        if a is not None:
            form.populate_absender(a)
        else:
            form.email.data = request.args.get('email')

    # new rock, fill in Gestein
    if request.args.get('gestein'):
        g = Gestein.query.get(request.args.get('gestein'))
        if g is not None:
            form.gestein_id.data = g.id
            form.gestein.data = g.name
        else:
            form.gestein.data = request.args.get('gestein')

    return render_template('reisesteine/backend/editStein.html', form=form)

def unique_filename(folder, filename):
    output_filename, file_extension = os.path.splitext(filename)
    n = ''
    while os.path.exists(os.path.join(current_app.static_folder, folder, f'{output_filename}{n}{file_extension}')):
        if isinstance(n, str):
            n = -1
        n += 1
    return f'{output_filename}{n}{file_extension}'

def optimize_image(filename, width):
    data = {
        'auth': {
            'api_key': current_app.config['KRAKEN_KEY'],
            'api_secret': current_app.config['KRAKEN_SECRET']
        },
        'url': url_for('static', filename=filename, _external=True),
        'wait': True,
        'lossy': True,
        'resize': {
            'width': width,
            'strategy': 'landscape'
        }
    }

    # response = requests.post('https://api.kraken.io/v1/url', json=data)
    
    # if response:
    #     json_response = response.json()
    #     urllib.request.urlretrieve(json_response.get('kraked_url'), os.path.join(current_app.static_folder, filename))
    # else:
    #     print(response.json().get('message'))

    return 'success'


@reisesteine.route('/steine/coordinates/all', methods=['GET'])
def coordinates_all():
    coord = Stein.query.with_entities(Stein.id, Stein.longitude, Stein.latitude).all()
    return jsonify(coord)

@reisesteine.route('/steine/images/all', methods=['GET'])
def images_all():
    img = Stein.query.with_entities(Stein.id, Stein.bild_stein).all()
    return jsonify(img)

@reisesteine.route('/steine/<int:id>', methods=['GET'])
def get_stein(id):
    ste = Stein.query.get(id)
    print(ste.to_dict())
    return jsonify(ste.to_dict())