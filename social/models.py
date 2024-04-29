from django.db import models

# create a model for the user
class Userdetails(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    date_of_birth = models.DateField()
    # make handle unique so that no two users can have the same handle and also same handle  is given then autochange the handle
    handle = models.CharField(max_length=100, unique=True)
    verified = models.BooleanField(default=False)
    last_login = models.DateTimeField(verbose_name='last login', blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True,default="male")
    profile_pic = models.ImageField(upload_to='profile_pics')
    friends = models.TextField(default='') # Comma-separated list of user IDs
    friend_requests = models.TextField(default='') # Comma-separated list of user IDs
    friend_requests_sent = models.TextField(default='') # Comma-separated list of user IDs
    bio= models.TextField(default='')
    location= models.CharField(max_length=100, blank=True, null=True)
    hobbies= models.TextField(default='', blank=True, null=True)
    contact_info= models.TextField(default='', blank=True, null=True)

    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        # Check if the handle is already taken
        if Userdetails.objects.filter(handle=self.handle).exists():
            # If the handle is already taken, generate a unique handle
            suffix = 1
            new_handle = self.handle
            while Userdetails.objects.filter(handle=new_handle).exists():
                suffix += 1
                new_handle = f"{self.handle}-{suffix}"  # Increment the suffix
            self.handle = new_handle

        # Call the parent class's save method
        super().save(*args, **kwargs)
    
class Posts(models.Model):
    user = models.ForeignKey(Userdetails, on_delete=models.CASCADE)
    text = models.TextField()
    post_id = models.AutoField(primary_key=True)
    likes = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    liked_by = models.TextField(default='') # Comma-separated list of user IDs
    comments= models.TextField(default='') # Comma-separated list of comment IDs
    email = models.EmailField(max_length=100)
    handle = models.CharField(max_length=100)
    image= models.ImageField(upload_to='posts', blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.name + ' - ' + str(self.date)
    
class Comments_text(models.Model):
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)
    user = models.ForeignKey(Userdetails, on_delete=models.CASCADE)
    text = models.TextField()
    comment_id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.name + ' - ' + str(self.date)
    