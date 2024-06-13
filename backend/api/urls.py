from django.urls import path
from . import views

urlpatterns = [
    path("assets/",views.AssetListCreate.as_view(),name="asset-list"),
    path("assets/delete/<int:pk>/",views.AssetDelete.as_view(),name="delete-asset"),
    path("getcurrprice/",views.FetchCurrentPrice,name="getcurrentprice"),
    path("getindicators/",views.returnIndicators,name="getindicators"),
    path("getindicatorscols/",views.getIndicatorCols,name="getindicatorscols"),
]
