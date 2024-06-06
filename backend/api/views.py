from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, AssetSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Asset
from .helpers.get_datafromApi import getSimplePricedata ,getCurrentPrice
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
class AssetListCreate(generics.ListCreateAPIView):
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Asset.objects.filter(owner=user)
    
    def perform_create(self,serializer):
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
        else:
            print(serializer.errors)
            
class AssetDelete(generics.DestroyAPIView):
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Asset.objects.filter(owner=user)
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
@csrf_exempt
def returnPriceInfo(request):
    if request.method == "POST":
        try: 
            request_data = json.loads(request.body)
            asset_data = getSimplePricedata(ticker=request_data.get("ticker"),
                                                 daysback=request_data.get("daysback"),
                                                 columns=request_data.get("column"))
            return JsonResponse({"data":asset_data},status = 200)
    
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'Missing input(s)'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@csrf_exempt
def FetchCurrentPrice(request):
    if request.method == "POST":
        try:
            request_data = json.loads(request.body)
            current_price = getCurrentPrice(request_data.get("ticker"))
            
            return JsonResponse({"data":current_price},status = 200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'Missing input(s)'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)