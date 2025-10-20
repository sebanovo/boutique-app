# 🏠 Sistema de Gestión de boutiques - Django API

<div align="center">
    <img width="791" height="565" alt="image" src="https://github.com/user-attachments/assets/6eec5181-0566-4e18-b5a5-7fd65889b53d" />
</div>

## 📦 Requisitos Previos
- Python 3.8+
- pip (gestor de paquetes de Python)
- Git

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <url-github>
cd folder
```

### 2. Crear entorno virtual (recomendado)
```bash
# Linux/Mac
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus configuraciones
# DEBUG=True
# SECRET_KEY=tu-clave-secreta-aqui
# DATABASE_URL=sqlite:///db.sqlite3
```

### 5. Configurar base de datos
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (admin)
python manage.py createsuperuser
# Sigue las instrucciones para crear usuario admin
```

### 6. Ejecutar servidor de desarrollo
```bash
python manage.py runserver
```

### 7. Acceder al sistema
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/
- Documentación API: http://localhost:8000/api/docs/

## 📋 Endpoints principales de la API

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/logout/` - Cerrar sesión

### Usuarios
- `GET /api/users/` - Listar usuarios
- `POST /api/users/` - Crear usuario
- `GET /api/users/{id}/` - Obtener usuario específico
- `PUT /api/users/{id}/` - Actualizar usuario
- `DELETE /api/users/{id}/` - Eliminar usuario
- `POST /api/users/{id}/upload_avatar/` - Subir avatar

### Casas
- `GET /api/casas/` - Listar casas
- `POST /api/casas/` - Crear casa
- `GET /api/casas/{id}/residentes/` - Residentes de una casa

### Reservas
- `GET /api/reservas/` - Listar reservas
- `POST /api/reservas/` - Crear reserva

## ⚙️ Configuración de variables de entorno

Archivo `.env`:
```env
DEBUG=True
SECRET_KEY=tu-clave-secreta-unica-y-segura
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
TIME_ZONE=America/Lima
LANGUAGE_CODE=es-pe
```

## 🗃️ Estructura del proyecto
```
mi-boutique/
├── .env.example          # Variables de entorno de ejemplo
├── requirements.txt      # Dependencias de Python
├── manage.py            # Script de gestión de Django
├── myproject/           # Configuración del proyecto
│   ├── settings.py      # Configuración principal
│   ├── urls.py          # URLs principales
│   └── wsgi.py          # WSGI configuration
└── myapp/               # Aplicación principal
    ├── models.py        # Modelos de base de datos
    ├── serializers.py   # Serializers para la API
    ├── views.py         # Vistas y endpoints
    ├── urls.py          # URLs de la app
    └── admin.py         # Configuración del admin
```

## 🔧 Comandos útiles

```bash
# Crear migraciones después de cambios en modelos
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar tests
python manage.py test

# Shell interactivo de Django
python manage.py shell

# Verificar estado de migraciones
python manage.py showmigrations
```

## 📊 Modelos principales
- **User** - Usuarios del sistema (extendido de Django)
- **Perfil** - Información adicional de usuarios
- **Casa** - Unidades habitacionales del boutique
- **Vehiculo** - Vehículos de residentes
- **AreaComun** - Áreas comunes disponibles
- **Reserva** - Reservas de áreas comunes
- **Multa** - Sistema de multas
- **IngresoSalida** - Control de acceso

## 🛡️ Permisos y autenticación
- Autenticación por tokens (DRF Token)
- Permisos basados en roles
- Grupos: Administradores, Residentes, Guardias

## 🤝 Contribución
1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia
Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte
- Documentación Django: https://docs.djangoproject.com/
- Documentación DRF: https://www.django-rest-framework.org/
- Issues: https://github.com/tuusuario/mi-boutique/issues

## 🚀 Despliegue en producción

Para producción, configurar:
- DEBUG=False
- Base de datos PostgreSQL
- Servidor WSGI (Gunicorn)
- Servidor web (Nginx)
- Servicio de almacenamiento (AWS S3 para archivos media)
