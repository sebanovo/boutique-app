from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from boutique.models import Online, Venta, VentaDetalle
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
@api_view(['GET'])
def obtener_pedidos_online(request):
    try:
        # ✅ Filtrar pedidos online en "Espera"
        online_pedidos = Online.objects.filter(estado='Espera').select_related('persona', 'venta')

        data = []
        for o in online_pedidos:
            # 🧩 Buscar detalles de la venta relacionada
            detalles = VentaDetalle.objects.filter(venta=o.venta)

            # 🔁 Convertir los detalles a JSON
            detalles_data = [
                {
                    "producto": d.producto.nombre if d.producto else None,
                    "categoria": d.producto.categoria.nombre if d.producto and d.producto.categoria else None,
                    "cantidad": d.cantidad,
                    "precio_unitario": float(d.producto.precio) if d.producto else 0,
                    "subtotal": float(d.subtotal),
                    "imagen": d.producto.url if d.producto else None,
                }
                for d in detalles
            ]

            # 🧾 Estructura del pedido con detalles
            data.append({
                "id": o.id,
                "estado": o.estado,
                "horario_envios": o.horario_envios.strftime("%H:%M:%S") if o.horario_envios else None,
                "cliente": o.persona.nombre if o.persona else None,
                "venta_id": o.venta.id if o.venta else None,
                "productos": detalles_data,
                "total": sum(d["subtotal"] for d in detalles_data)
            })

        return Response({
            "success": True,
            "total": len(data),
            "data": data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"success": False, "error": f"Error al obtener pedidos online: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
def entregar(request, id):
    linea = Online.objects.filter(id=id).first()
    if not linea:
        return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    # Actualizar estado
    linea.estado = 'Entregado'
    linea.save()

    return Response({"success": True, "mensaje": f"Pedido {id} entregado"}, status=status.HTTP_200_OK)
