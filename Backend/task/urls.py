from django.urls import path
from .views import get_tasks,task_detail,register,logout
from rest_framework_simplejwt.views import( TokenObtainPairView,TokenRefreshView) 
'''
TokenObtainPairView → Used during Login. It gives you Access Token + Refresh Token.
TokenRefreshView → Used later when the Access Token expires. It gives you a new Access Token
'''
urlpatterns =[
    path('tasks/',get_tasks),
    path('tasks/<int:pk>/',task_detail), 
    path('register/',register,name='register'),
    path('login/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    #TokenObtainPairView,TokenRefreshView are classes so.as_view() convert them into aviewable function
    path('logout/',logout),

]

'''
Receive request
        │
        ▼
Read username/password
        │
        ▼
Find user in database
        │
        ▼
Check password
        │
   Correct?
      │
 ┌────┴────┐
 │         │
Yes       No
 │         │
 ▼         ▼
Generate   Return Error
Tokens
'''
'''
example for second url
/tasks/1/
/tasks/2/
/tasks/3/
'''


'''
If someone visits:

/tasks/

run:

get_tasks()


prjecturl/appurl
''       + tasks/ = tasks/
api/     + tasks/ = api/tasks/
v1/api/  + tasks/ = v1/api/tasks/
'''