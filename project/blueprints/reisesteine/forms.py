from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, BooleanField, SubmitField, DecimalField, TextAreaField, IntegerField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Optional
from wtforms.fields.html5 import EmailField
from project.models import Gestein, Stein, Person

class editSteinForm(FlaskForm):
    stein_id =          IntegerField('Stein ID', validators=[Optional()])
    user_id =           IntegerField('Absender ID', validators=[Optional()])
    gestein_id =        IntegerField('Gestein ID', validators=[Optional()])

    vorname =           StringField('Vorname', validators=[DataRequired()])
    nachname =          StringField('Nachname', validators=[DataRequired()])
    email =             EmailField('Email', validators=[DataRequired(), Email()])
    telefon =           StringField('Telefonnummer')
    instagram =         StringField('Instagram')
    twitter =           StringField('Twitter')
    facebook =          StringField('Facebook')

    gestein =           StringField('Gestein', validators=[DataRequired()])
    
    herkunft =          StringField('Herkunft', validators=[DataRequired()])
    longitude =         DecimalField('Longitude', places=15, validators=[DataRequired()])
    latitude =          DecimalField('Longitude', places=15, validators=[DataRequired()])
    titel =             StringField('Titel')
    pers_geschichte =   TextAreaField('Persönliche Geschichte')
    geo_geschichte =    TextAreaField('Geologische Einschätzung', validators=[DataRequired()])
    # bild_stein =        FileField('Bild Stein', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])
    # bild_herkunft =     FileField('Bild Fundort', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])
    bild_stein =        FileField('Bild Stein', validators=[FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])
    bild_herkunft =     FileField('Bild Fundort', validators=[FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])

    submit = SubmitField('Speichern')

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

    def populate(self, curr_stein):
        self.user_id.data = curr_stein.absender.id
        self.vorname.data = curr_stein.absender.vorname
        self.nachname.data = curr_stein.absender.nachname
        self.email.data = curr_stein.absender.email
        self.telefon.data = curr_stein.absender.telefon
        self.instagram.data = curr_stein.absender.instagram
        self.twitter.data = curr_stein.absender.twitter
        self.facebook.data = curr_stein.absender.facebook

        self.gestein_id.data = curr_stein.gesteinsart.id
        self.gestein.data = curr_stein.gesteinsart.name

        self.stein_id.data = curr_stein.id
        self.herkunft.data = curr_stein.herkunft
        self.longitude.data = curr_stein.longitude
        self.latitude.data = curr_stein.latitude
        self.titel.data = curr_stein.titel
        self.pers_geschichte.data = curr_stein.pers_geschichte
        self.geo_geschichte.data = curr_stein.geo_geschichte
        self.bild_stein.data = curr_stein.bild_stein
        self.bild_herkunft.data = curr_stein.bild_herkunft

    def populate_absender(self, absender):
        self.user_id.data = absender.id
        self.vorname.data = absender.vorname
        self.nachname.data = absender.nachname
        self.email.data = absender.email
        self.telefon.data = absender.telefon
        self.instagram.data = absender.instagram
        self.twitter.data = absender.twitter
        self.facebook.data = absender.facebook