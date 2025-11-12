from django.db import models

# =========================
# 1️⃣ ROL
# =========================
class Rol(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

# =========================
# 2️⃣ PERSONA (antes Usuario)
# =========================
class Persona(models.Model):
    usuario = models.CharField(max_length=100, null=True, blank=True)
    nombre = models.CharField(max_length=100, null=True, blank=True)
    apellidop = models.CharField(max_length=100, null=True, blank=True)
    apellidom = models.CharField(max_length=100, null=True, blank=True)
    telefono = models.CharField(max_length=100, null=True, blank=True)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)
    correo = models.CharField(max_length=50, null=True, blank=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    def __str__(self):
        return self.nombre or "Sin nombre"

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
    url = models.CharField(max_length=777, null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    suma_calificaciones = models.IntegerField(default=0)  # solo de 5⭐
    cantidad_comprada = models.IntegerField(default=0)
    costo_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @property
    def promedio_calificacion(self):
        if self.cantidad_comprada > 0:
            return round(self.suma_calificaciones / self.cantidad_comprada, 2)
        return 0

    def __str__(self):
        return self.nombre

# =========================
# 5️⃣ METODO DE PAGO
# =========================
class MetodoPago(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
class AperturaCaja(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    administrador = models.ForeignKey( Persona, on_delete=models.SET_NULL, null=True, blank=True, related_name="cajas_administradas")
    montoInicio = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"Apertura {self.id} - Fecha: {self.fecha.strftime('%d/%m/%Y %H:%M')}"# =========================

# =========================
# CIERRE DE CAJA
# =========================
class CierreDeCaja(models.Model):  
    usuarioapertura = models.ForeignKey(Persona, on_delete=models.SET_NULL, null=True, blank=True, related_name="cajas_abiertas")       
    montoFinal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    caja = models.ForeignKey(AperturaCaja, on_delete=models.CASCADE, null=True, blank=True)  # ✅ Corregido: caja minúscula y relación correcta
    fecha_cierre = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Cierre {self.id} - Caja: {self.caja.id}"
# 6️⃣ VENTA
# =========================

# =========================
# 7️⃣ VENTA DETALLE
# =========================
class VentaDetalle(models.Model):
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    venta = models.ForeignKey('Venta',null=True, on_delete=models.CASCADE, related_name='detalles')  # ✅ FALTA ESTO
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, blank=True)
    cantidad= models.IntegerField(default=1)
    def __str__(self):
        return f"Detalle {self.id} - Subtotal: {self.subtotal}"
        
class Venta(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    tipo_pago = models.ForeignKey(MetodoPago, on_delete=models.SET_NULL, null=True, blank=True)
    persona = models.ForeignKey(Persona, on_delete=models.SET_NULL, null=True, blank=True)  # ← cambio
    def __str__(self):
        return f"Venta {self.id} - Total: {self.total if hasattr(self,'total') else 'N/A'}"

# =========================
# 8️⃣ BITÁCORA
# =========================
class Bitacora(models.Model):
    descripcion = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    persona = models.ForeignKey(Persona, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Bitacora {self.id} - Persona: {self.persona}"

# =========================
# 9️⃣ HORARIOS
# =========================
class Horario(models.Model):
    inicio = models.TimeField()
    fin = models.TimeField()
    dias = models.CharField(max_length=100)
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, related_name="horarios")

    def __str__(self):
        return f"{self.persona} - {self.dias} ({self.inicio} a {self.fin})"

# =========================
# 🔟 AVISOS
# =========================
class Aviso(models.Model):
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)
    contenido = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Aviso de {self.persona}"

# =========================
# 11️⃣ RECLAMOS
# =========================
class Reclamo(models.Model):
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)
    detalle = models.TextField()
    lugar_web = models.CharField(max_length=200)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reclamo {self.id} - {self.persona}"

# =========================
# 12️⃣ PROMOCIONES
# =========================
class Promocion(models.Model):
    creado_en = models.DateTimeField(auto_now_add=True)
    nombre = models.CharField(max_length=100)
    url = models.CharField(max_length=500, null=True, blank=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    descripcion = models.TextField(blank=True, null=True)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2)
    creado_por = models.ForeignKey(Persona, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nombre

# =========================
# 13️⃣ DESCUENTOS
# =========================
class Descuento(models.Model):
    creado_en = models.DateTimeField(auto_now_add=True)
    creado_por = models.ForeignKey(Persona, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2)
    url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.porcentaje}% ({self.fecha_inicio} - {self.fecha_fin})"

# =========================
# 14️⃣ DESCUENTOS - PRODUCTOS
# =========================
class DescuentoProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    promocion = models.ForeignKey(Promocion, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.producto} → {self.promocion}"

# =========================
# 15️⃣ PERMISOS
# =========================
class Permiso(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# =========================
# 16️⃣ PERMISOS - ROL
# =========================
class PermisoRol(models.Model):
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.rol} → {self.permiso}"

# =========================
# 17️⃣ PERSONA - PERMISOS
# =========================
class PersonaPermiso(models.Model):
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)
    permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.persona} → {self.permiso}"

# =========================
# 18️⃣ LOCAL
# =========================
class Local(models.Model):
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)
    nit = models.CharField(max_length=20, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    apertura = models.ForeignKey(AperturaCaja, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return f"{self.nombre} {self.apellido}"

# =========================
# 19️⃣ ONLINE
# ===========Online==============
class Online(models.Model):
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    estado = models.CharField(max_length=50, default="Espera")
    horario_envios = models.TimeField(max_length=100, null=True, blank=True)
    venta= models.ForeignKey(Venta ,null=True, on_delete=models.CASCADE)
    def __str__(self):
        return f"Online {self.persona}"

# =========================
# COSTOS
# =========================
class CostoLaboral(models.Model):
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)
    horas_trabajadas = models.DecimalField(max_digits=6, decimal_places=2)
    pago_por_hora = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField(auto_now_add=True)

    @property
    def total(self):
        return self.horas_trabajadas * self.pago_por_hora

class CostoIndirecto(models.Model):
    descripcion = models.CharField(max_length=200)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField(auto_now_add=True)
    url = models.CharField(max_length=750, null=True, blank=True)
    persona = models.ForeignKey(
        Persona,
        on_delete=models.CASCADE,
        null=True,  # ✅ permitir null temporalmente
        blank=True
    )
    tipo = models.CharField(max_length=50, choices=[
        ('servicio agua', 'Servicio de Agua'),
        ('servicio internet', 'Servicio de Internet'),
        ('servicio luz', 'Servicio de Luz'),
        ('mantenimiento', 'Mantenimiento'),
        ('administrativo', 'Administrativo'),
        ('otros', 'Otros'),
    ])

    def __str__(self):
        return f"{self.descripcion} - {self.monto}"

# =========================
# COSTO ENVIO
# =========================
class CostoEnvio(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    distancia_km = models.DecimalField(max_digits=6, decimal_places=2)
    costo_transporte = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return f"Envío de venta {self.venta.id} - {self.distancia_km} km"
