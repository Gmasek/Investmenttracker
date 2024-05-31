from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Asset

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","password"]
        extra_kwargs = {"password":{"write_only":True}}
        

    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ["id","ticker","qty","owner"]
        extra_kwargs = {"owner":{"read_only":True}}