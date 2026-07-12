from .models import Task
from .serializers import TaskSerializer,RegisterSerializer

from rest_framework.response import Response #whenever react act something django need to response 
from rest_framework.decorators import api_view,permission_classes # to make sure this function is an API
from rest_framework import status
from rest_framework.permissions import IsAuthenticated#IsAuthenticated is used to allow access to an API view only if the user has successfully logged
#in and provided a valid authentication token

from rest_framework_simplejwt.tokens import RefreshToken #RefreshToken class used to crrate object,to store in blacklist

@api_view(['GET','POST']) #this function below is an API endpoint for get and post request 
@permission_classes([IsAuthenticated])
def get_tasks(request): #create a function called get_tasks getting request from ui 
    if request.method == 'GET':
      task = Task.objects.filter(user = request.user)# 👉 “Give me ONLY tasks that belong to the logged-in user.”
      serializer = TaskSerializer(task,many=True)# put all the data into serializer for conversion(JSON->python object) beacuse it only for get
      #many = true, because all fields should be applicable not one row from db all row we need to take it so serializer should convert all
      #data into JSON
      return Response(serializer.data,status=status.HTTP_200_OK) #return the respons ie; the serialized Json data 
    
    elif request.method == 'POST':

      serializer = TaskSerializer(data = request.data) #we will put the incoming JSON data into serializer,it will validate the date

      if serializer.is_valid(): #serializer validate find no prblem
        serializer.save(user = request.user)#Create a new row inside MySQL.
        return Response(serializer.data,status=status.HTTP_201_CREATED)  #data  responding
      
      return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST) #error showing
      

@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated]) #Only logged-in users with a valid JWT token are allowed to access this API
def task_detail(request,pk):
   
   try:
      task = Task.objects.get(id=pk,user=request.user)
   except Task.DoesNotExist:
      return Response({
         "error":"Task Not Found"
      },status=status.HTTP_404_NOT_FOUND)

   if request.method == 'GET':
      serializer = TaskSerializer(task)

      return Response(serializer.data,status=status.HTTP_200_OK)
   
   elif request.method == 'PUT':
      serializer = TaskSerializer(task,data = request.data)

      if serializer.is_valid():
        serializer.save()

        return Response(serializer.data,status=status.HTTP_200_OK)
      
      return Response(serializer.errors)
   
   elif request.method == 'DELETE':
      
      task.delete()
      
      return Response({"message ":"Task Deleted Succesfully"},status=status.HTTP_200_OK)
   

@api_view(['POST'])
def register(request):
   serializer = RegisterSerializer(data = request.data)
   
   if serializer.is_valid():
      serializer.save()
      return Response({"message" : "User Registered Successfully"},status=status.HTTP_201_CREATED) 
   
   return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

'''
MySQL
  ↓
Python Objects (Task instances)
  ↓
Serializer
  ↓
JSON
  ↓
Response
  ↓
React/Browser
'''
# Create your views here.
@api_view(['POST']) #Only POST requests can call this API.
@permission_classes([IsAuthenticated])#Only a logged-in user can log out.
def logout(request):
   try:
      refresh_token = request.data['refresh']
      '''
      The frontend sends:

{
    "refresh": "eyJhbGc......"
}

This line takes that refresh token from the request.
      '''
      token = RefreshToken(refresh_token) #Creates a RefreshToken object from the token string.
      token.blacklist() #"Never allow this refresh token to be used again."
      
      return Response(
         {"message": "Logged out successfully"},status=status.HTTP_200_OK)

   except Exception:
      return Response({
         "error": "Invalid Refresh Token"
      },status= status.HTTP_400_BAD_REQUEST)
  