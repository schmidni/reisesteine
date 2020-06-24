from project import db
from datetime import datetime

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vorname = db.Column(db.String(32))
    nachname = db.Column(db.String(32))
    wohnort = db.Column(db.String(32))
    email = db.Column(db.String(32), unique=True)
    telefon = db.Column(db.String(32))
    instagram = db.Column(db.String(32))
    twitter = db.Column(db.String(32))
    facebook = db.Column(db.String(32))
    steine = db.relationship('Stein', backref='absender', lazy='dynamic')
    newsletter = db.Column(db.Boolean, default=False)
    newsletter_registered = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '{}, {}'.format(self.vorname, self.nachname) 

    @classmethod
    def get_or_create(cls, id = None):
        absender = None
        if id is not None:
            absender = cls.query.get(id)
        if absender is None:
            absender = cls()
        return absender
    
    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)

class Gestein(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    steine = db.relationship('Stein', backref='gesteinsart', lazy='dynamic')

    def __repr__(self):
        return '{}'.format(self.name) 

    @classmethod
    def get_or_create(cls, id = None, name = None):
        gestein = None
        if id is not None:
            gestein = cls.query.get(id)
        if gestein is None and name is not None:
            gestein = cls.query.filter_by(name = name).first()
        if gestein is None:
            gestein = cls()
        return gestein

class Bild(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(64))
    stein = db.Column(db.Integer, db.ForeignKey('stein.id'))

    def __repr__(self):
        return '{},{},{}'.format(self.id, self.filename, self.stein) 

class Stein(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gestein = db.Column(db.Integer, db.ForeignKey('gestein.id'))
    herkunft = db.Column(db.String(32))
    land = db.Column(db.String(32))
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    titel = db.Column(db.String(128))
    pers_geschichte = db.Column(db.String(1))
    geo_geschichte = db.Column(db.String(1))
    bild_stein = db.Column(db.String(64))
    bild_herkunft = db.Column(db.String(64))
    absender_id = db.Column(db.Integer, db.ForeignKey('person.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    published = db.Column(db.Boolean, index=True)
    description = db.Column(db.String(1))
    user_bilder = db.relationship('Bild', backref='stein_ref', lazy='dynamic')
    bemerkungen = db.Column(db.String(1))

    def __repr__(self):
        return '{}, {}'.format(self.gestein, self.herkunft)

    @classmethod
    def get_or_create(cls, id = None):
        stein = None
        if id is not None:
            stein = cls.query.get(id)
        if stein is None:
            stein = cls()
        return stein

    def populate(self, form):
        self.herkunft = form.herkunft.data
        self.land = form.land.data
        self.longitude = form.longitude.data
        self.latitude = form.latitude.data
        self.titel = form.titel.data
        self.pers_geschichte = form.pers_geschichte.data
        self.geo_geschichte = form.geo_geschichte.data
        self.bemerkungen = form.bemerkungen.data

    def to_dict(self):
        data = {
            'id': self.id,
            'gestein': self.gesteinsart.name,
            'herkunft': self.herkunft,
            'land': self.land,
            'longitude': self.longitude,
            'latitude': self.latitude,
            'titel': self.titel,
            'pers_geschichte': self.pers_geschichte,
            'geo_geschichte': self.geo_geschichte,
            'bild_stein': self.bild_stein,
            'bild_herkunft': self.bild_herkunft,
            'absender': self.absender.vorname,
            'wohnort': self.absender.wohnort,
            'description': self.description
        }
        return data