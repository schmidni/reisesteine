from project import app
from project import cli
from project import db
from project.models import Person, Stein, Gestein

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Absender': Absender, 'Stein': Stein, 'Gestein': Gestein}