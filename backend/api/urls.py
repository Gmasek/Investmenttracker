from django.urls import path
from . import views

urlpatterns = [
    path("assets/",views.AssetListCreate.as_view(),name="asset-list"),
    path("assets/delete/<int:pk>/",views.AssetDelete.as_view(),name="delete-asset"),
    path("getasset/",views.returnPriceInfo,name="getListData")
]
