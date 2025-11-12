import stripe
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

# Configurar Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(["POST"])
def create_payment(request):
    """Crea un PaymentIntent y devuelve el clientSecret."""
    try:
        amount = int(request.data.get("amount", 0))
        if amount <= 0:
            return Response({"error": "Monto inválido"}, status=400)

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            automatic_payment_methods={"enabled": True},
        )
        return Response({"clientSecret": intent.client_secret})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@csrf_exempt
def stripe_webhook(request):
    """Escucha los eventos de Stripe."""
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    event = None

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        print(f"💰 Pago recibido correctamente: {intent['id']} por {intent['amount']} USD")

    return HttpResponse(status=200)
