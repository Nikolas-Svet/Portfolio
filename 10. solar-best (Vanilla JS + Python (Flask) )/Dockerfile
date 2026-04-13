FROM python:3.9-slim-buster

WORKDIR /app

COPY ./app /app/
COPY requirements.txt /app/

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --trusted-host pypi.python.org -r requirements.txt

EXPOSE 5015

CMD ["flask", "run", "--host=0.0.0.0", "--port=5015"]
