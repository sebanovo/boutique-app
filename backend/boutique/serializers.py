from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *

# =========================
# ROLES
# =========================
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

# =========================
# PERSONA
# =========================
class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'  # O los campos que quieras mostrar

# =========================
# CATEGORIA
# =========================
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# =========================
# PRODUCTO
# =========================
class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)  # ← categoría anidada completa
    promedio_calificacion = serializers.ReadOnlyField()

    class Meta:
        model = Producto
        fields = '__all__'

# =========================
# METODO DE PAGO
# =========================
class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = '__all__'

# =========================
# VENTAS
# =========================
class VentaDetalleSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = VentaDetalle
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    persona = serializers.PrimaryKeyRelatedField(queryset=Persona.objects.all())
    tipo_pago = serializers.PrimaryKeyRelatedField(queryset=MetodoPago.objects.all())
    detalles = VentaDetalleSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = '__all__'

# =========================
# COSTOS
# =========================
class CostoEnvioSerializer(serializers.ModelSerializer):
    venta = VentaSerializer(read_only=True)

    class Meta:
        model = CostoEnvio
        fields = '__all__'

class CostoLaboralSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(read_only=True)  # ← Cambio aquí
    total = serializers.ReadOnlyField()

    class Meta:
        model = CostoLaboral
        fields = '__all__'

class CostoIndirectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostoIndirecto
        fields = '__all__'

# =========================
# LOGS Y GESTIÓN
# =========================
class BitacoraSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(read_only=True)  # ← Cambio aquí

    class Meta:
        model = Bitacora
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(read_only=True)

    class Meta:
        model = Horario
        fields = '__all__'

class AvisoSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(read_only=True)

    class Meta:
        model = Aviso
        fields = '__all__'

class ReclamoSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(read_only=True)

    class Meta:
        model = Reclamo
        fields = '__all__'

# =========================
# DESCUENTOS Y PROMOCIONES
# =========================
class PromocionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocion
        fields = '__all__'

class DescuentoSerializer(serializers.ModelSerializer):
    creado_por = PersonaSerializer(read_only=True)  # ← Cambio aquí

    class Meta:
        model = Descuento
        fields = '__all__'

class DescuentoProductoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    promocion = PromocionSerializer(read_only=True)

    class Meta:
        model = DescuentoProducto
        fields = '__all__'

# =========================
# PERMISOS Y ROLES
# =========================
class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permiso
        fields = '__all__'

class PermisoRolSerializer(serializers.ModelSerializer):
    rol = RolSerializer(read_only=True)
    permiso = PermisoSerializer(read_only=True)

    class Meta:
        model = PermisoRol
        fields = '__all__'

class PersonaPermisoSerializer(serializers.ModelSerializer):  # ← Cambio aquí
    persona = PersonaSerializer(read_only=True)
    permiso = PermisoSerializer(read_only=True)

    class Meta:
        model = PersonaPermiso
        fields = '__all__'

# =========================
# LOCAL Y ONLINE
# =========================
class LocalSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(read_only=True)

    class Meta:
        model = Local
        fields = '__all__'

class OnlineSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(read_only=True)

    class Meta:
        model = Online
        fields = '__all__'

class DashboardMetricasSerializer(serializers.Serializer):
    total_ventas = serializers.IntegerField()
    total_ingresos = serializers.FloatField()
    total_productos_vendidos = serializers.IntegerField()
    ticket_promedio = serializers.FloatField()
    ventas_promedio_dia = serializers.FloatField()

class DashboardVentasDiaSerializer(serializers.Serializer):
    fecha_dia = serializers.DateField()
    cantidad_ventas = serializers.IntegerField()
    total_ingresos = serializers.FloatField()

class DashboardProductosSerializer(serializers.Serializer):
    producto__id = serializers.IntegerField()
    producto__nombre = serializers.CharField()
    producto__categoria__nombre = serializers.CharField()
    producto__precio = serializers.FloatField()
    cantidad_vendida = serializers.IntegerField()
    ingresos_totales = serializers.FloatField()
    veces_vendido = serializers.IntegerField()

class DashboardTendenciaSerializer(serializers.Serializer):
    tendencia_porcentaje = serializers.FloatField()
    ventas_actual = serializers.IntegerField()
    ventas_anterior = serializers.IntegerField()
    es_positiva = serializers.BooleanField()