from django.contrib import admin
from .models import Tobacco

# Register your models here.


class TobaccoAdmin(admin.ModelAdmin):
    list_display = ("brand", "taste", "supplier", "purchase_date", "best_before_date", "price", "weight")
    list_filter = ["organization"]
    search_fields = ("brand", "taste", "supplier")


admin.site.register(Tobacco, TobaccoAdmin)
