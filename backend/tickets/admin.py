from django.contrib import admin
from .models import Ticket, UserProfile

admin.site.register(Ticket)
admin.site.register(UserProfile)