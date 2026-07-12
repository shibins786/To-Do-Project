from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('task.urls'))
]

'''
path('', include('task.urls'))
means:
Don't add anything.
Pass the request directly to task.urls
So:

http://127.0.0.1:8000/tasks/

goes directly to:
path('tasks/', get_tasks)
'''