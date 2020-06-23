from flask import jsonify, json, render_template, Blueprint, g, redirect, request, current_app, abort, url_for, make_response
from project.blueprints.reisesteine.forms import EditSteinForm, MitmachenForm
from project import db
from project.models import Gestein, Stein, Person
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_wtf.file import FileRequired
from sqlalchemy.sql import exists

from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()

from PIL import Image

import requests
import urllib.request
import os

users = {
    'admin': generate_password_hash("reisesteine2020")
}

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
    if g.lang_code not in current_app.config['LANGUAGES']:
        abort(404)

# Verification ************************************
@auth.verify_password
def verify_password(username, password):
    if username in users and \
            check_password_hash(users.get(username), password):
        return username


# Frontend Routes ************************************
@reisesteine.route('/')
@auth.login_required
def index():
    steine = Stein.query.filter_by(published=True).join(Gestein.steine).with_entities(Stein.id, Stein.latitude, Stein.longitude, Gestein.name, Stein.titel, Stein.herkunft).all()
    return render_template('reisesteine/home.html', steine=steine, ste=None)

@reisesteine.route('/uber-uns', defaults={'lang_code': 'de'})
@reisesteine.route('/about', defaults={'lang_code': 'en'})
@auth.login_required
def about():
    steine = Stein.query.filter_by(published=True).join(Gestein.steine).with_entities(Stein.id, Stein.latitude, Stein.longitude, Gestein.name, Stein.titel, Stein.herkunft).all()
    return render_template('reisesteine/about.html', steine=steine, id='about')


@reisesteine.route('/stein/<id>', defaults={'lang_code': 'de'})
@reisesteine.route('/stone/<id>', defaults={'lang_code': 'en'})
@auth.login_required
def stein(id):        
    ste = Stein.query.get(id)
    if not ste or not ste.published:
        return redirect(url_for('reisesteine.index'))
    steine = Stein.query.filter_by(published=True).join(Gestein.steine).with_entities(Stein.id, Stein.latitude, Stein.longitude, Gestein.name, Stein.titel, Stein.herkunft).all()
    ste = ste.to_dict()
    return render_template('reisesteine/home.html', id=id, steine=steine, ste=ste)

@reisesteine.route('/steine/<int:id>', methods=['GET'])
def get_stein(id):
    ste = Stein.query.get(id)
    if ste:
        return jsonify(ste.to_dict())
    else:
        return make_response('Not Found', 404)


@reisesteine.route('/steine', defaults={'lang_code': 'de'})
@reisesteine.route('/stones', defaults={'lang_code': 'en'})
@auth.login_required
def steine():
    steine = Stein.query.filter_by(published=True).join(Gestein.steine).with_entities(Stein.id, Stein.latitude, Stein.longitude, Gestein.name, Stein.titel, Stein.herkunft).all()
    return render_template('reisesteine/home.html', id='steine', steine=steine, ste=None)


@reisesteine.route('/geschichten', defaults={'lang_code': 'de'})
@reisesteine.route('/stories', defaults={'lang_code': 'en'})
@auth.login_required
def geschichten():
    steine = Stein.query.filter_by(published=True).join(Gestein.steine).with_entities(Stein.id, Stein.latitude, Stein.longitude, Gestein.name, Stein.titel, Stein.herkunft).all()
    return render_template('reisesteine/home.html', id='geschichten', steine=steine, ste=None)


@reisesteine.route('/geologie', defaults={'lang_code': 'de'})
@reisesteine.route('/geology', defaults={'lang_code': 'en'})
@auth.login_required
def geologie():
    steine = Stein.query.filter_by(published=True).join(Gestein.steine).with_entities(Stein.id, Stein.latitude, Stein.longitude, Gestein.name, Stein.titel, Stein.herkunft).all()
    return render_template('reisesteine/home.html', id='geologie', steine=steine, ste=None)


@reisesteine.route('/fundorte', defaults={'lang_code': 'de'})
@reisesteine.route('/places', defaults={'lang_code': 'en'})
@auth.login_required
def fundorte():
    steine = Stein.query.filter_by(published=True).join(Gestein.steine).with_entities(Stein.id, Stein.latitude, Stein.longitude, Gestein.name, Stein.titel, Stein.herkunft).all()
    return render_template('reisesteine/home.html', id='fundorte', steine=steine, ste=None)

@reisesteine.route('/steine/coordinates/all', methods=['GET'])
def coordinates_all():
    coord = Stein.query.filter_by(published=True).with_entities(Stein.id, Stein.latitude, Stein.longitude).all()
    return jsonify(coord)

@reisesteine.route('/steine/images/all', methods=['GET'])
def steine_all():
    img = Stein.query.filter_by(published=True).with_entities(Stein.id, Stein.bild_stein).all()
    return jsonify(img)

@reisesteine.route('/fundorte/images/all', methods=['GET'])
def fundorte_all():
    img = Stein.query.filter_by(published=True).with_entities(Stein.id, Stein.bild_herkunft).all()
    return jsonify(img)

@reisesteine.route('/geschichten/all', methods=['GET'])
def geschichten_all():
    gesch = Stein.query.filter_by(published=True).with_entities(Stein.id, Stein.titel).all()
    return jsonify(gesch)

@reisesteine.route('/geologie/all', methods=['GET'])
def geologie_all():
    geo = Stein.query.filter_by(published=True).join(Gestein.steine).with_entities(Stein.id, Gestein.name, Stein.herkunft, Stein.land).all()
    return jsonify(geo)

@reisesteine.route('/marion')
def marion():
    return redirect('mailto:mariond@bluewin.ch')

@reisesteine.route('/nicolas')
def nicolas():
    return redirect('mailto:nicolas@breiten.ch')

@reisesteine.route('/focusTerra')
def focusTerra():
    return redirect('mailto:info_focusTerra@erdw.ethz.ch')

# Mitmachen Routes *************************************
@reisesteine.route('/mitmachen', defaults={'lang_code': 'de'}, methods=['GET', 'POST'])
@reisesteine.route('/participate', defaults={'lang_code': 'en'}, methods=['GET', 'POST'])
@auth.login_required
def mitmachen():
    form = MitmachenForm()
    
    if form.validate_on_submit():
        print(len(form.bild_stein.data))

    return render_template('reisesteine/mitmachen.html', form=form)

# Mitmachen Routes *************************************
@reisesteine.route('/mitmachen/danke', defaults={'lang_code': 'de'})
@reisesteine.route('/participate/thanks', defaults={'lang_code': 'en'})
@auth.login_required
def danke():
    return render_template('reisesteine/danke.html')

# Backend Routes *************************************
@reisesteine.route('/listSteine')
@auth.login_required
def listSteine():
    steine = Stein.query.all()
    return render_template('reisesteine/backend/listSteine.html', steine=steine)

@reisesteine.route('/deleteStein/<id>')
@auth.login_required
def deleteStein(id):
    os.remove(os.path.join(current_app.static_folder, 'img/steine', Stein.query.get(id).bild_stein))
    os.remove(os.path.join(current_app.static_folder, 'img/steine', Stein.query.get(id).bild_herkunft))
    Stein.query.filter_by(id=id).delete()
    db.session.commit()
    return redirect(url_for('reisesteine.listSteine'))

@reisesteine.route('/newStein', methods=['POST'])
@auth.login_required
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
@auth.login_required
def editStein(id):
    form = EditSteinForm()

    if form.validate_on_submit():

        # get or create absender
        absender = Person.get_or_create(id = form.user_id.data)
        absender.update(**form.data)

        # get or create gestein
        gestein = Gestein.get_or_create(id = form.gestein_id.data)
        gestein.name = form.gestein.data

        # get or create stein
        stein = Stein.get_or_create(id=form.stein_id.data)

        # assign
        stein.populate(form)
        stein.absender = absender
        stein.gesteinsart = gestein

        # process stein bild
        if (form.bild_stein.data):
            fn_stein= ''
            f_stein = form.bild_stein.data
            if f_stein:
                fn_stein = unique_filename('img/steine', secure_filename(f_stein.filename))
                f_stein.save(os.path.join(current_app.static_folder, 'img/steine', fn_stein))
            with Image.open(os.path.join(current_app.static_folder, 'img/steine', fn_stein)) as img:
                width, height = img.size
            optimize_image(os.path.join('img/steine', fn_stein), min(width, 1000))
            if stein.bild_stein:
                os.remove(os.path.join(current_app.static_folder, 'img/steine', stein.bild_stein))
            stein.bild_stein = fn_stein

        # process herkunft bild
        if (form.bild_herkunft.data):
            fn_her = ''
            f_her = form.bild_herkunft.data
            if f_her:
                fn_her = unique_filename('img/steine', secure_filename(f_her.filename))
                f_her.save(os.path.join(current_app.static_folder, 'img/steine', fn_her))
            with Image.open(os.path.join(current_app.static_folder, 'img/steine', fn_her)) as img:
                width, height = img.size
            optimize_image(os.path.join('img/steine', fn_her), min(width, 1980))
            if stein.bild_herkunft:
                os.remove(os.path.join(current_app.static_folder, 'img/steine', stein.bild_herkunft))
            stein.bild_herkunft = fn_her

        # save and redirect back to list
        db.session.add(stein)
        db.session.commit()
        return redirect(url_for('reisesteine.listSteine'))

    bild_stein = None
    bild_herkunft = None

    # edit an existing rock
    if id is not None:
        curr_stein = Stein.query.get(id)
        form.populate(curr_stein)
        bild_stein = curr_stein.bild_stein
        bild_herkunft = curr_stein.bild_herkunft

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

    return render_template('reisesteine/backend/editStein.html', form=form, stein=bild_stein, herkunft=bild_herkunft)


# Helper Functions *************************************
def unique_filename(folder, filename):
    output_filename, file_extension = os.path.splitext(filename)
    n = ''
    while os.path.exists(os.path.join(current_app.static_folder, folder, f"{output_filename}{n}{file_extension}")):
        if isinstance(n, str):
            n = -1
        n += 1
    return f"{output_filename}{n}{file_extension}"

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