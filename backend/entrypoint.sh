#!/usr/bin/env sh
set -e

echo "Esperando a PostgreSQL en $POSTGRES_HOST:$POSTGRES_PORT..."
until python - <<'PY'
import os, socket, sys
host = os.environ.get("POSTGRES_HOST", "db")
port = int(os.environ.get("POSTGRES_PORT", "5432"))
try:
    with socket.create_connection((host, port), timeout=2):
        sys.exit(0)
except OSError:
    sys.exit(1)
PY
do
  echo "DB no disponible, reintentando..."
  sleep 1
done
echo "PostgreSQL listo."

# Evitar crear proyecto nuevo (ya existe en el repo)
# if [ ! -f "manage.py" ]; then
#   django-admin startproject config .
# fi

echo "Aplicando makemigrations (si no hay cambios, no pasa nada)..."
python manage.py makemigrations || true
echo "Aplicando migraciones (django-tenants: esquema public y tenants)..."
python manage.py migrate --noinput

# Ejecutar seeds si existen
python manage.py seed || echo "No se pudo ejecutar seeds"


# Preparar carpetas de static y media
echo "Preparando carpetas de static y media..."
mkdir -p /app/staticfiles /app/media || true
chmod -R 777 /app/staticfiles /app/media 2>/dev/null || true

# collectstatic SOLO si DEBUG está desactivado
case "$(printf '%s' "$DEBUG" | tr '[:upper:]' '[:lower:]')" in
  1|y|yes|true)
    echo "DEBUG activo → salto collectstatic"
    ;;
  *)
    echo "Ejecutando collectstatic..."
    python manage.py collectstatic --noinput || true
    ;;
esac

echo "Levantando servidor de desarrollo..."
python manage.py runserver 0.0.0.0:8000

# Para producción, reemplazar la línea anterior con:
# gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
