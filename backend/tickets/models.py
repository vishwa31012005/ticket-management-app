from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

class Ticket(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[('open', 'Open'), ('in_progress', 'In Progress'), ('resolved', 'Resolved')],
        default='open'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    customer = models.ForeignKey(User, related_name='tickets', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(
        User,
        related_name='assigned_tickets',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    def __str__(self):
        return self.title

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=20,
        choices=[('customer', 'Customer'), ('agent', 'Agent')],
        default='customer'
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


# ✅ Updated signal to reliably detect status change
@receiver(post_save, sender=Ticket)
def send_status_update_email(sender, instance, created, **kwargs):
    if not created:
        try:
            old_instance = Ticket.objects.get(pk=instance.pk)
        except Ticket.DoesNotExist:
            return

        if old_instance.status != instance.status:
            subject = f'Ticket "{instance.title}" Status Update'
            message = f"""
Dear {instance.customer.username},

Your ticket "{instance.title}" status has been updated to: {instance.status}.

Thank you,
Support Team
"""
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [instance.customer.email],
                fail_silently=False,
            )