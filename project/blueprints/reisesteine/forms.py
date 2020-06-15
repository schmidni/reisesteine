from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, BooleanField, SubmitField, DecimalField, TextAreaField, IntegerField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Optional
from wtforms.fields.html5 import EmailField
from project.models import Gestein, Stein, Person
from werkzeug.datastructures import FileStorage
from flask import current_app
import re
import os

class editSteinForm(FlaskForm):
    stein_id =          IntegerField('Stein ID', validators=[Optional()])
    user_id =           IntegerField('Absender ID', validators=[Optional()])
    gestein_id =        IntegerField('Gestein ID', validators=[Optional()])

    vorname =           StringField('Vorname*', validators=[DataRequired()])
    nachname =          StringField('Nachname')
    wohnort =           StringField('Wohnort *', validators=[DataRequired()])
    email =             EmailField('Email *', validators=[DataRequired(), Email()])
    telefon =           StringField('Telefonnummer')
    instagram =         StringField('Instagram')
    twitter =           StringField('Twitter')
    facebook =          StringField('Facebook')

    gestein =           StringField('Gestein*', validators=[DataRequired()])
    
    herkunft =          StringField('Herkunft *', validators=[DataRequired()])
    land =              StringField('Land *', validators=[DataRequired()])
    longitude =         StringField('Longitude *', validators=[DataRequired()])
    latitude =          StringField('Latitude *', validators=[DataRequired()])
    titel =             StringField('Titel')
    pers_geschichte =   TextAreaField('Persönliche Geschichte')
    geo_geschichte =    TextAreaField('Geologische Einschätzung *', validators=[DataRequired()])
    bild_stein =        FileField('Bild Stein *', validators=[FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])
    bild_herkunft =     FileField('Bild Fundort *', validators=[FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])
    published =         BooleanField('Published', default=False)

    submit = SubmitField('Speichern')

    def validate_longitude(self, longitude):
        try:
            longitude.data = float(longitude.data)
        except ValueError:
            deg, minutes, seconds, direction =  re.split('[°\'"]', longitude.data.replace(" ", ""))
            longitude.data = (float(deg) + float(minutes)/60 + float(seconds)/(60*60)) * (-1 if direction in ['W', 'S'] else 1)

    def validate_latitude(self, latitude):
        try:
            latitude.data = float(latitude.data)
        except ValueError:
            deg, minutes, seconds, direction =  re.split('[°\'" ]', latitude.data.replace(" ", ""))
            latitude.data = (float(deg) + float(minutes)/60 + float(seconds)/(60*60)) * (-1 if direction in ['W', 'S'] else 1)


    def validate_gestein(self, gestein):
        by_name = Gestein.query.filter_by(name=gestein.data).first()
        
        if self.gestein_id.data:
            by_id = Gestein.query.get(self.gestein_id.data)
        else:
            by_id = None
        if by_name is not None and by_name != by_id:
            raise ValidationError('Dieses Gestein gibt es bereits. Wert zurückgesetzt')

    def validate_email(self, email):
        by_name = Person.query.filter_by(email=email.data).first()
        
        if self.user_id.data:
            by_id = Person.query.get(self.user_id.data)
        else:
            by_id = None
        if by_name is not None and by_name != by_id:
            self.email.data = email.data
            raise ValidationError('Diese Email gibt es bereits. Wert zurückgesetzt.')

        
    def validate_bild_stein(self, bild_stein):
        # if stein gets created, require bild
        if not self.stein_id.data and not bild_stein.data:
            raise ValidationError('Stein Bild Required')
        # check if an image exists in db
        bild = Stein.query.get(self.stein_id.data)
        if bild:
            bild = bild.bild_stein
            if not bild_stein.data and not bild:
                raise ValidationError('Stein Bild Required')
        # check image size
        if bild_stein.data:
            bild_stein.data.seek(0, os.SEEK_END)
            if bild_stein.data.tell() > 1*1024*1024:
                raise ValidationError('Stein Bild zu gross')
            bild_stein.data.seek(0)


    def validate_bild_herkunft(self, bild_herkunft):
        # if stein gets created, require bild
        if not self.stein_id.data and not bild_herkunft.data:
            raise ValidationError('Stein Bild Required')
        # check if an image exists in db
        bild = Stein.query.get(self.stein_id.data)
        if bild:
            bild = bild.bild_herkunft
            if not bild_herkunft.data and not bild:
                raise ValidationError('Herkunft Bild Required')
        # check image size
        if bild_herkunft.data:
            bild_herkunft.data.seek(0, os.SEEK_END)
            if bild_herkunft.data.tell() > 2*1024*1024:
                raise ValidationError('Stein Fundort zu gross')
            bild_herkunft.data.seek(0)


    def populate(self, curr_stein):

        self.user_id.data = curr_stein.absender.id
        self.vorname.data = curr_stein.absender.vorname
        self.nachname.data = curr_stein.absender.nachname
        self.wohnort.data = curr_stein.absender.wohnort
        self.email.data = curr_stein.absender.email
        self.telefon.data = curr_stein.absender.telefon
        self.instagram.data = curr_stein.absender.instagram
        self.twitter.data = curr_stein.absender.twitter
        self.facebook.data = curr_stein.absender.facebook

        self.gestein_id.data = curr_stein.gesteinsart.id
        self.gestein.data = curr_stein.gesteinsart.name

        self.stein_id.data = curr_stein.id
        self.herkunft.data = curr_stein.herkunft
        self.land.data = curr_stein.land
        self.longitude.data = curr_stein.longitude
        self.latitude.data = curr_stein.latitude
        self.titel.data = curr_stein.titel
        self.pers_geschichte.data = curr_stein.pers_geschichte
        self.geo_geschichte.data = curr_stein.geo_geschichte
        self.published.data = curr_stein.published

    def populate_absender(self, absender):
        self.user_id.data = absender.id
        self.vorname.data = absender.vorname
        self.nachname.data = absender.nachname
        self.wohnort.data = absender.wohnort
        self.email.data = absender.email
        self.telefon.data = absender.telefon
        self.instagram.data = absender.instagram
        self.twitter.data = absender.twitter
        self.facebook.data = absender.facebook