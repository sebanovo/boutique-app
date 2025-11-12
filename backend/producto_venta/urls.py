from django.urls import path
from .Logica.Categoria import crear_categoria, extraer_categoria
from .Logica.Producto import Crear_producto, extraer_producto,extraer
from .Logica.TipoPago import extraer_tipo_pago  # ✅ importa solo la función
from .Logica.Usuario import Crear_persona_cliente,verRol,verUsuario,login,Crear_persona_personal
from boutique.serializers import *
from .Logica.Stripe import *
from .Logica.Venta import venta_online,venta_local
from .Logica.Promociones import *
from .Logica.Reporte import DashboardDinamicoAPI
from .Logica.Reportes import EstadoResultadosAPI
from .Logica.Gastos import obtener_tipos_costo,crear_costo,extraer_todos_los_costos,eliminar_costo
from .Logica.notificaciones import enviar_correo
from .Logica.AperturaCaja import crear_apertura,extraer_caja
from .Logica.Envio import obtener_pedidos_online,entregar

urlpatterns = [
    # -------- Usuario --------
    path("usuario/cliente/crear/", Crear_persona_cliente),
    path("usuario/Personal/crear/", Crear_persona_personal),
    path("rol/", verRol),
    path("persona/", verUsuario),
    path("login/", login),

    #----------reporte------------
    path('dashboard/',DashboardDinamicoAPI.as_view()),  # ✅ CORREGIDO: agregar .as_view()
    path('estado-resultados/',EstadoResultadosAPI.as_view()),  # ✅ CORREGIDO: agregar .as_view()
    

    #----------Promociones------------
    path("promocion/crear/", crear_promocion, name="crear_promocion"),
    path("promocion/extraer/", extraer_promociones, name="extraer_promociones"),
    path("promocion/eliminar/<int:id>/",eliminar_promocion, name="eliminar_promocion"),
    path("producto/extraer/", extraer_productos, name="extraer_productos"),


    #----------venta------------
    path("pedido/cliente/",venta_online),
    path("pedido/local/",venta_local),
    path("pedido/onlinne/",obtener_pedidos_online),
    path("pedido/entregar/<int:id>/",entregar),


    #pagos Stripe
    path("create-payment/", create_payment, name="create-payment"),
    path("stripe-webhook/", stripe_webhook, name="stripe-webhook"),

    # -------- Categorías --------
    path("categoria/extraer/", extraer_categoria, name="extraer_categoria"),
    path("categoria/crear/", crear_categoria, name="crear_categoria"),

    # -------- Productos --------
    path("producto/extraer/", extraer_producto, name="extraer_producto"),
    path("extraer/", extraer),
    path("producto/crear/", Crear_producto, name="crear_producto"),

    # -------- Tipo de Pago --------
    path("tipoPago/extraer/", extraer_tipo_pago, name="extraer_tipo_pago"),

    # -------- Tipo de Gastos --------
    path("tipos-costo/", obtener_tipos_costo, name="extraer_tipo_pago"),
    path("costo/crear/", crear_costo),
    path("costo/eliminar/<int:id>", eliminar_costo),
    path("costo/extraer/", extraer_todos_los_costos),

    #notufucaciones 
    path("enviar-correo/", enviar_correo),
    #---apertura de caja----------
    path("aperturaCaja/crear/",crear_apertura),
    path("aperturaCaja/extrer/hoy/",extraer_caja),
]