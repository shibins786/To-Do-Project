from rest_framework import serializers
from .models import Task

from django.contrib.auth.models import User #Import djnago built in user model

'''
python model create a python object like this ,but react can't understand it ,react only understand JSON
serializer is a validator and a translator covert (Python Object <-> JSON)
task = Task(
    title="Learn React",
    description="Finish Props"
)
'''
'''
React
 ↓ JSON
Serializer
 ↓ Python Object
Model
 ↓ SQL
MySQL
'''
class TaskSerializer(serializers.ModelSerializer): #create a serializer called TaskSerializer for Task Object
    class Meta:
        model = Task # model name that need to translate
        fields = '__all__' # in this models what are the fields need to translate
        read_only_fields = ['user']#👉 “Frontend is NOT allowed to send or edit this field”


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)#password is a string we can write the password but never read it back for security

    class Meta:
        model = User
        fields = ['username','email','password']
        
    def create(self,validated_data): #validated_data =>data that has already passed validation by serializer not stored like username,password,email after  serializer.is_valid()

        user = User.objects.create_user( #Create a new user in Django's built-in User model.create_user=>Creates the user ✅,Hashes the password ✅,Saves the user in the database ✅
            username = validated_data['username'], #validated is like a python dictionary 
            email = validated_data['email'], 
            password= validated_data['password']

        )
        #create_user hashes the password before storing it
        return user


'''
നീ ഇതിനുമുമ്പ് TaskSerializer ഉപയോഗിച്ച് Task create ചെയ്തത് ഓർമ്മയുണ്ടല്ലോ?

POST request വന്നാൽ:

{
    "title":"Learn Django",
    "description":"Study serializers"
}

നീ ചെയ്തിരുന്നത്:

serializer = TaskSerializer(data=request.data)

if serializer.is_valid():
    serializer.save()

ഇവിടെ ഒരു ചോദ്യം:

serializer.save() എങ്ങനെ Task database-ൽ save ചെയ്യുന്നു?

നീ എവിടെയും എഴുതിയിട്ടില്ല:

Task.objects.create(...)

എന്നിട്ടും save ആയി.

കാരണം ModelSerializer-ൽ Django-യ്ക്ക് ഒരു default create() function ഉണ്ട്.

അകത്ത് conceptually ഇങ്ങനെ നടക്കും:

Task.objects.create(
    title="Learn Django",
    description="Study serializers"
)

ഇപ്പോൾ User Registration-ലേക്ക് വരാം.

User create ചെയ്യുമ്പോൾ Django-യുടെ default create ഉപയോഗിച്ചാൽ conceptually ഇങ്ങനെ ആകും:

User.objects.create(
    username="shibin",
    email="shibin@gmail.com",
    password="shibin123"
)

ഇത് ഒരു പ്രശ്നമാണ്.

കാരണം password plain text ആയി database-ൽ save ആവും.

password = shibin123

❌ Wrong

നമുക്ക് വേണം:

User.objects.create_user(
    username="shibin",
    email="shibin@gmail.com",
    password="shibin123"
)

ഇത് password hash ചെയ്ത് save ചെയ്യും.

password = pbkdf2_sha256$....

✅ Correct

അപ്പോൾ serializer-നോട് നാം പറയുകയാണ്:

"User save ചെയ്യുമ്പോൾ Django-യുടെ default create ഉപയോഗിക്കരുത്. അതിനു പകരം എന്റെ create function ഉപയോഗിക്കണം."

അതാണ്:

def create(self, validated_data):

ഇപ്പോൾ ഈ line നോക്ക്:

serializer.save()

നീ view-ൽ ഇത് എഴുതുമ്പോൾ,

Django അകത്ത് ഇങ്ങനെ ചിന്തിക്കും:

ഓഹ്...
ഈ serializer-ൽ create() function ഉണ്ടല്ലോ

എന്നാൽ അത് വിളിക്കാം

അതായത്:

serializer.save()

↓

create(validated_data)

↓

User.objects.create_user(...)

↓

User database-ൽ save

അതായത് നമ്മുടെ create() function-ന്റെ ജോലി:

User എങ്ങനെ create ചെയ്യണം എന്ന്
serializer-ന് പറഞ്ഞുകൊടുക്കുക
'''