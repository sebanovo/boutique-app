from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from boutique.models import Promocion, Producto, DescuentoProducto, Persona
from boutique.serializers import PromocionSerializer

@csrf_exempt
@require_http_methods(["POST"])
def crear_promocion(request):
    try:
        data = json.loads(request.body)
        print("Datos recibidos:", data)  # Para debug    
    # Crear la promoción
        promocion = Promocion(
            nombre=data['nombre'],
            url=data.get('url', ''),
            fecha_inicio=data['fecha_inicio'],
            fecha_fin=data['fecha_fin'],
            descripcion=data.get('descripcion', ''),
            porcentaje=data['porcentaje'],
            creado_por_id = request.session.get('id')
        )
        promocion.save()
        productos_ids = data.get('Productos', [])  # Cambié 'productos' por 'Productos' para coincidir con tu frontend
        if productos_ids:
            for producto_id in productos_ids:
                try:
                    producto = Producto.objects.get(id=producto_id)
                    DescuentoProducto.objects.create(
                        producto=producto,
                        promocion=promocion
                    )
                except Producto.DoesNotExist:
                    print(f"Producto con ID {producto_id} no encontrado")
                    continue

        return JsonResponse({
            'success': True,
            'message': 'Promoción creada exitosamente',
            'promocion_id': promocion.id
        })

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Error en el formato JSON'
        }, status=400)
    except Exception as e:
        print("Error completo:", str(e))
        return JsonResponse({
            'success': False,
            'message': f'Error al crear la promoción: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def extraer_promociones(request):
    try:
        promociones = Promocion.objects.all().order_by('-creado_en')
        serializer = PromocionSerializer(promociones, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        return JsonResponse({
            'error': f'Error al obtener promociones: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def extraer_productos(request):
    try:
        productos = Producto.objects.all().order_by('nombre')
        data = [{
            'id': producto.id,
            'nombre': producto.nombre,
            'precio': float(producto.precio),
            'categoria': producto.categoria.nombre if producto.categoria else 'Sin categoría'
        } for producto in productos]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({
            'error': f'Error al obtener productos: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def eliminar_promocion(request, id):
    try:
        promocion = Promocion.objects.get(id=id)
        promocion.delete()
        return JsonResponse({
            'success': True,
            'message': 'Promoción eliminada exitosamente'
        })
    except Promocion.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'La promoción no existe'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error al eliminar la promoción: {str(e)}'
        }, status=500)