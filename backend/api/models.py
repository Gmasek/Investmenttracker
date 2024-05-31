from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Asset(models.Model):
    ticker = models.CharField(max_length=10)
    qty = models.DecimalField(max_digits=10,decimal_places=3)
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="assets")
    
    def __str__(self) -> str:
        return self.title