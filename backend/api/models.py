from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Asset(models.Model):
    ticker = models.CharField(max_length=6)
    held_qty = models.DecimalField(decimal_places=3,max_digits=10)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="assets")
    
    def __str__(self) -> str:
        return self.ticker