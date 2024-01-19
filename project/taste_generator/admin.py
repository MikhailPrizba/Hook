from django.contrib import admin
from .models import Generator

# Register your models here.


class GeneratorAdmin(admin.ModelAdmin):
    list_display = ("main", "second", "tint")
    list_filter = ["main"]
    search_fields = ("main", "second", "tint")


admin.site.register(Generator, GeneratorAdmin)