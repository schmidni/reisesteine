#!/bin/bash

source env/bin/activate

export FLASK_APP=wsgiG.py
export FLASK_DEBUG=1

flask run

# gunicorn -w 4 -b 0.0.0.0:5000 --reload --log-level=info 'wsgiG:app'
deactivate
