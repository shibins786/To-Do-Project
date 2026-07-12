from django.db import models
from django.contrib.auth.models import User

class Task(models.Model): #creating a db table called Task
    title = models.CharField(max_length=200) #Task title column
    description = models.TextField() #task description column
    status = models.CharField(max_length=200,default="Pending") # task status column,at first task status defaultly pending because it is not completed(Sets the date/time only when the object is created.)
    created_at = models.DateTimeField(auto_now_add=True)#task started time column automatically add by django
    updated_at = models.DateTimeField(auto_now=True)#marking the updated time column,it willl not empty or null at the start because started time and updated time saved as same at first(It automatically updates to the current time.)
    completed_at = models.DateTimeField(null=True,blank=True) #null=True=>It means the database is allowed to store null beacause at initially the completed time is unknown so the value would be null,
    user = models.ForeignKey(User,on_delete = models.CASCADE) #creating a table column called user,👉 “Connect this Task to Django’s User table”,👉 If the user is deleted → delete all their tasks automatically
    '''
Without blank=True
completed_at = models.DateTimeField()

If a user submits a form and leaves completed_at empty, Django says:
This field is required.and the form validation fails.

With blank=True
Now the user can leave it empty.
    '''
    def __str__(self):
        return self.title   #"When you print this object or show it in the admin panel, display the title."
    




# Create your models here.
