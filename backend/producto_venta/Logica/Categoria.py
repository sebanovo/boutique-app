from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from boutique.models import Categoria

@api_view(["GET"])
def extraer_categoria(request):
    try:
        categorias = Categoria.objects.all().values("id", "nombre", "detalle")
        data = list(categorias)
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["POST"])
def crear_categoria(request):
    try:
        # Verificar que los datos sean JSON válidos
        if not request.data:
            return Response(
                {"error": "No se proporcionaron datos"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        nombre = request.data.get("nombre")
        detalle = request.data.get("detalle", "")  # Valor por defecto vacío
        
        if not nombre:
            return Response(
                {"error": "El nombre es obligatorio"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear la categoría
        categoria = Categoria.objects.create(
            nombre=nombre, 
            detalle=detalle
        )
        
        # Devolver respuesta estructurada
        response_data = {
            "id": categoria.id, 
            "nombre": categoria.nombre, 
            "detalle": categoria.detalle,
            "message": "Categoría creada exitosamente"
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": f"Error al crear categoría: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )