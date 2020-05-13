from project import app
from project import cli
from project import db
from project.models import Person, Stein, Gestein

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Person': Person, 'Stein': Stein, 'Gestein': Gestein}