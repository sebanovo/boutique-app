# views.py
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def enviar_correo(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            destinatario = data.get("correo")
            mensaje = data.get("mensaje")

            send_mail(
                subject="Mensaje desde Django",
                message=mensaje,
                from_email='jhonatanleonel777@gmail.com',
                recipient_list=[destinatario],
                fail_silently=False,
            )

            return JsonResponse({"status": "Correo enviado correctamente!"})

        except Exception as e:
            return JsonResponse({"status": f"Error: {str(e)}"})
