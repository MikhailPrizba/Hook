#!/bin/sh
chmod a+x static/
python manage.py collectstatic
python manage.py makemigrations
python manage.py migrate

#run server
gunicorn project.wsgi:application --bind 0.0.0.0:8000
