from boutique.models import CostoIndirecto,Persona
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
import json

def obtener_tipos_costo(request):
    tipos = [
        {'value': value, 'label': label}
        for value, label in CostoIndirecto._meta.get_field('tipo').choices
    ]
    return JsonResponse(tipos, safe=False)

@api_view(['POST'])
def crear_costo(request):
    try:
        data = json.loads(request.body)
        print("📦 Datos recibidos:", data)

        persona_id = request.session.get('id')
        if not persona_id:
            return JsonResponse({
                'success': False,
                'message': 'No se encontró el ID de la persona en la sesión'
            }, status=400)

        persona = Persona.objects.get(id=persona_id)

        costo = CostoIndirecto.objects.create(
            descripcion=data.get('descripcion', ''),
            monto=data.get('monto', 0),
            url=data.get('url', ''),
            tipo=data.get('tipoGasto', ''),
            persona=persona
        )

        return JsonResponse({
            'success': True,
            'message': '✅ Costo indirecto registrado correctamente',
            'data': {
                'id': costo.id,
                'descripcion': costo.descripcion,
                'monto': str(costo.monto),
                'tipo': costo.tipo
            }
        }, status=201)

    except Persona.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'La persona asociada no existe'
        }, status=404)

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Error en el formato JSON'
        }, status=400)

    except Exception as e:
        print("❌ Error completo:", str(e))
        return JsonResponse({
            'success': False,
            'message': f'Error al crear el costo: {str(e)}'
        }, status=500)
    
@api_view(['DELETE'])
def eliminar_costo(request, id=None):
    try:
        if id is None:
            data = json.loads(request.body)
            id = data.get('id')
            if id is None:
                return JsonResponse({'success': False, 'message': 'ID no proporcionado'}, status=400)

        costo = CostoIndirecto.objects.get(id=id)
        costo.delete()

        return JsonResponse({'success': True, 'message': 'Costo eliminado correctamente'})

    except CostoIndirecto.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Costo no encontrado'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Error en el formato JSON'}, status=400)

    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Error: {str(e)}'}, status=500)


@api_view(["GET"])
def extraer_todos_los_costos(request):
    try:
        costo = CostoIndirecto.objects.all().values("id", "descripcion", "monto","fecha","url","persona","tipo")
        data = list(costo)
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    