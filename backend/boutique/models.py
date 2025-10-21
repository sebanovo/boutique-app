from django.db import models
from django.contrib.auth.models import AbstractUser

# =========================
# 1️⃣ ROL
# =========================
class Rol(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

# =========================
# 2️⃣ USUARIO
# =========================
class Usuario(AbstractUser):
    username = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} - {self.email}"

    @property
    def photo_url(self):
        if self.photo:
            return f"/media/{self.photo.name}"
        return None

# =========================
# 3️⃣ CATEGORIA
# =========================
class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    detalle = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# =========================
# 4️⃣ PRODUCTO
# =========================
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    cantidad = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    codigo_barra = models.CharField(max_length=50, unique=True, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nombre

# =========================
# 5️⃣ METODO DE PAGO
# =========================
class MetodoPago(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

# =========================
# 6️⃣ VENTA
# =========================
class Venta(models.Model):
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField()
    hora = models.TimeField()
    tipo_pago = models.ForeignKey(MetodoPago, on_delete=models.SET_NULL, null=True, blank=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    NIT = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"Venta {self.id} - Total: {self.total}"

# =========================
# 7️⃣ VENTA DETALLE
# =========================
class VentaDetalle(models.Model):
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, blank=True)
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name="detalles")

    def __str__(self):
        return f"Detalle {self.id} - Subtotal: {self.subtotal}"

# =========================
# 8️⃣ BITÁCORA
# =========================
class Bitacora(models.Model):
    descripcion = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Bitacora {self.id} - Usuario: {self.usuario}"
