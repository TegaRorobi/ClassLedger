from django.db import models

class Payment(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    matric_number = models.BigIntegerField(null=False, blank=False)
    amount = models.IntegerField(null=False, blank=False)
    reason = models.CharField(max_length=200, null=True, blank=True)
    receipt = models.ImageField(upload_to='receipt_images', null=False, blank=False)
    confirmed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
    
