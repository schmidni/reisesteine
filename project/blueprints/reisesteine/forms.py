from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, BooleanField, SubmitField, DecimalField, TextAreaField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo
from wtforms.fields.html5 import EmailField
from project.models import Gestein, Stein, Person

class NeuerSteinFormular(FlaskForm):
    vorname =           StringField('Vorname', validators=[DataRequired()])
    nachname =          StringField('Nachname', validators=[DataRequired()])
    email =             EmailField('Email', validators=[DataRequired(), Email()])
    telefon =           StringField('Telefonnummer')
    instagram =         StringField('Instagram')
    twitter =           StringField('Twitter')
    facebook =          StringField('Facebook')

    gestein =      StringField('Gestein', validators=[DataRequired()])
    
    herkunft =          StringField('Herkunft')
    longitude =         DecimalField('Longitude', places=15, validators=[DataRequired()])
    latitude =          DecimalField('Longitude', places=15, validators=[DataRequired()])
    titel =             StringField('Titel')
    pers_geschichte =   TextAreaField('Persönliche Geschichte')
    geo_geschichte =    TextAreaField('Geologische Einschätzung', validators=[DataRequired()])
    # bild_stein =        FileField('Bild Stein', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])
    # bild_herkunft =     FileField('Bild Fundort', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])
    bild_stein =        FileField('Bild Stein', validators=[FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])
    bild_herkunft =     FileField('Bild Fundort', validators=[FileAllowed(['jpg', 'png', 'gif'], 'Images only!')])

    submit = SubmitField('Submit')
    # def validate_username(self, username):
    #     user = User.query.filter_by(username=username.data).first()
    #     if user is not None:
    #         raise ValidationError('Please use a different username.')