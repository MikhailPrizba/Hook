FROM python:3.10

WORKDIR /project

ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH="."
COPY . .
RUN pip install --upgrade pip
RUN pip install pipenv


RUN pipenv install --system --deploy --dev




RUN chmod a+x entrypoint/*.sh