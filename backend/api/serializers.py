from django.contrib.auth.models import User
from rest_framework import serializers 
from .models import Asset

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","password"]
        extra_kwargs = {"password":{"write_only":True}}
        
    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class AssetSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ["ticker","curr_price","held_qty","user"]
        extra_kwargs = {"user":{"read_only":True}}