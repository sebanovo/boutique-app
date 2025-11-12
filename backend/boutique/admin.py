from django.contrib import admin

# Register your models here.
admin.site.site_header = "boutique Admin"
admin.site.site_title = "boutique Admin Portal"
admin.site.index_title = "Welcome to boutique Admin Portal"

from .models import (
    Persona,
    # Casa,
    # Vehiculo,
    # AreaComun,
    # Reserva,
    # Multa,
    # IngresoSalida,
    # Extranjero,
)

admin.site.register(Persona)
# admin.site.register(Casa)
# admin.site.register(Vehiculo)
# admin.site.register(AreaComun)
# admin.site.register(Reserva)
# admin.site.register(Multa)
# admin.site.register(IngresoSalida)
# admin.site.register(Extranjero)
