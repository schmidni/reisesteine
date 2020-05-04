from app import db
from datetime import datetime

class Absender(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vorname = db.Column(db.String(32))
    nachname = db.Column(db.String(32))
    email = db.Column(db.String(32), unique=True)
    telefon = db.Column(db.String(32), unique=True)
    instagram = db.Column(db.String(32))
    twitter = db.Column(db.String(32))
    facebook = db.Column(db.String(32))
    steine = db.relationship('Stein', backref='absender', lazy='dynamic')

    def __repr__(self):
        return '<{}, {}>'.format(self.vorname, self.nachname) 

class Gestein(db.Model):
    name = db.Column(db.String(32), primary_key=True)
    steine = db.relationship('Stein', backref='gestein', lazy='dynamic')

    def __repr__(self):
        return '<{}>'.format(self.name) 

class Stein(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gestein = db.Column(db.String(32), db.ForeignKey('gestein.name'))
    herkunft = db.Column(db.String(32), index=True)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    titel = db.Column(db.String(128))
    pers_geschichte = db.Column(db.String(1))
    geo_geschichte = db.Column(db.String(1))
    bild_stein = db.Column(db.String(64))
    bild_herkunft = db.Column(db.String(64))
    absender_id = db.Column(db.Integer, db.ForeignKey('absender.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<{}, {}>'.format(self.name, self.herkunft)    