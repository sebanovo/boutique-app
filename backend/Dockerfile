FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copiar y actualizar requirements
COPY requirements.txt /app/requirements.txt

# Instalar todas las dependencias incluyendo reportlab y openpyxl
RUN pip install --no-cache-dir -r /app/requirements.txt \
    && pip install --no-cache-dir reportlab openpyxl

# Copiar el resto del proyecto
COPY . /app

EXPOSE 8000
