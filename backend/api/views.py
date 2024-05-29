from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,AssetSerialiser
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Asset
from .helpers.get_datafromApi import getSimplePricedata
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
# Create your views here.


class AssetListingView(generics.ListCreateAPIView):
    serialiser_class = AssetSerialiser
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Asset.objects.filter(user=user)
    
    def create_new(self,serialiser):
        if serialiser.isvalid():
            serialiser.save(user=self.request.user)
        else:
            print(serialiser.errors)    
            
class RemoveAssetFromList(generics.DestroyAPIView):
    serialiser_class = AssetSerialiser
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Asset.objects.filter(user=user)
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
@csrf_exempt
def returnPriceInfo(request):
    if request.method == "POST":
        try: 
            request_data = json.loads(request.body)
            asset_data = list(getSimplePricedata(request_data.get("ticker"),request_data.get("window"),request_data.get("field")))
            return JsonResponse({"result":asset_data},status = 200)
    
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'Missing input(s)'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)