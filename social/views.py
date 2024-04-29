from django.shortcuts import render ,redirect
from django.urls import path
from django.contrib.auth.models import auth
from django.contrib import messages
from django.core.files.uploadedfile import InMemoryUploadedFile
import csv
from django.utils import timezone
from django.contrib.auth import authenticate, login
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from .models import Userdetails , Posts ,Comments_text
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse 
from django.utils.http import urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
import random
from django.utils.encoding import force_str
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import datetime
from PIL import Image
from io import BytesIO
import os

def compress_image(image_file, quality=60):
    """
    Compresses an image file.

    Args:
        image_file (InMemoryUploadedFile): Uploaded image file.
        quality (int, optional): Quality of the compressed image (0-100). Defaults to 85.

    Returns:
        BytesIO: Compressed image data.
    """
    try:
        with Image.open(image_file) as img:
            output_buffer = BytesIO()
            img.save(output_buffer, format='JPEG', quality=quality)
            return output_buffer
    except Exception as e:
        print(f"Error: {e}")
        return None

class OTPGenerator:
    @staticmethod
    def generate_otp():
        """
        Generate a 6-digit OTP.
        """
        return ''.join(str(random.randint(0, 9)) for _ in range(6))
    
def send_verification_email(user, request):
    otp = OTPGenerator.generate_otp()
    user = Userdetails.objects.get(email=user.email)
    print(user)
    
    user.otp = otp
    user.save()
    domain = get_current_site(request).domain
    verification_url = reverse('verify_email', kwargs={'uidb64': urlsafe_base64_encode(force_bytes(user.email)), 'token': otp})
    full_verification_url = f"https://{domain}{verification_url}"
    
    subject = 'Verify Your Email Address'
    text_content = render_to_string('verification_email.txt', {'user': user, 'verification_url': full_verification_url, 'otp': otp})
    html_content = render_to_string('verification_email.html', {'user': user, 'verification_url': full_verification_url, 'otp': otp})
    
    msg = EmailMultiAlternatives(subject, text_content, 'support@inspirehub.xyz', [user.email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()




def format_time_difference(post_date):
    current_time = timezone.now()  # Get current time with timezone information
    time_difference = current_time - post_date

    # Calculate time difference in seconds
    seconds_diff = time_difference.total_seconds()

    # Convert seconds to days, hours, and minutes
    days_diff = seconds_diff // (3600 * 24)
    hours_diff = (seconds_diff % (3600 * 24)) // 3600
    minutes_diff = (seconds_diff % 3600) // 60

    if days_diff >= 30:
        return post_date.strftime('%Y-%m-%d')
    elif days_diff > 0:
        return f"{int(days_diff)} days ago"
    elif hours_diff > 0:
        return f"{int(hours_diff)} hours ago"
    else:
        return f"{int(minutes_diff)} minutes ago"


def home(request):
    # Retrieve the logged-in user
    logged_in_user = request.user if request.user.is_authenticated else None
    if not logged_in_user:
        return redirect('login')
    custom_user_instance = Userdetails.objects.get(email=logged_in_user.email)
    if not custom_user_instance.verified:
        return redirect('verification-email-sent')
    posts = Posts.objects.order_by('-date')[:10]

        # Convert posts to a list of dictionaries
    posts_data = []
    comments_data = []

    for post in posts:
            
            if post.liked_by:
                # check if the user has liked the post already
                liked_by = post.liked_by.split(',')
                if logged_in_user.email in liked_by:
                    liked = True
                else:
                    liked = False
            else:
                liked = False
            # compare the date of the post with the current date
            formatted_time_difference = format_time_difference(post.date)

            if post.comments:
                comments = post.comments.split(',')
                print(comments)
                for comment_id in comments:
                  if comment_id.strip():
                    try:
                        comment = Comments_text.objects.get(comment_id=comment_id.strip())
                        print(comment)
                        comment_data = {
                                    'user': comment.user.name,
                                    'profile_pic': comment.user.profile_pic.url,
                                    'text': comment.text,
                                    'post_id': comment.post.post_id,
                                    'gender': comment.user.gender,
                                    'date': format_time_difference(comment.date),
                                    'comment_id': comment.comment_id
                                }
                        comments_data.append(comment_data)
                    except:
                        Comments_text.DoesNotExist
            if comments_data:
               comments_data = comments_data[::-1] 
            post_data = {
                'user': post.user.name,
                'profile_pic': post.user.profile_pic.url,
                'text': post.text,
                'gender': post.user.gender,
                'post_id': post.post_id,
                'likes': post.likes,
                'liked': liked,
                'comment_count': post.comment_count,
                
                'liked_by': post.liked_by.split(',') if post.liked_by else [],
                'comments': comments_data,
                'email': post.email,
                'handle': post.handle,
                'image': post.image.url if post.image else None,
                'date':  formatted_time_difference 
            }
            posts_data.append(post_data)
    context = {
        "title": "Home",
        "custom_user": custom_user_instance,  
        "posts": posts_data,
    }
    return render(request, 'index.html', context)

def register(request):
    if request.user.is_authenticated:
        return redirect('')
    
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        # print gender from the form
     
        if form.is_valid():
            user = Userdetails(
                name=form.cleaned_data.get('name'),
                email=form.cleaned_data.get('email'),
                date_of_birth=form.cleaned_data.get('date_of_birth'),
                handle=form.cleaned_data.get('handle'),
                gender=form.data.get('gender'),
            ) 
      
            user.save()
            
            # Save the form data
            user =form.save()
            authenticated_user = authenticate(request, username=user.email, password=form.cleaned_data.get('password1'))
            auth.login(request, authenticated_user)
            send_verification_email(user, request)
            messages.success(request, 'Account created successfully. Please verify your email address.')
            return redirect('verification-email-sent')
        else:
             errors = form.errors.values()
             i = 0
             for error in errors:
                    if i == 0:
                     i+=1
                     messages.error(request, f"{error}")
    else:
        form = CustomUserCreationForm()
    context = {
        "title": "Register",
        "form": form,
    }
    return render(request, 'register.html', context)


def login(request):
    if request.method == "POST":
        form = CustomAuthenticationForm(request, request.POST)
    form = CustomAuthenticationForm()
    if request.user.is_authenticated:
        return redirect('')
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username= request.POST.get('username')
            password= request.POST.get('password')  
            user= authenticate(request, username=username, password=password)
            if user is not None:
                auth.login(request, user )
                return redirect('')
            
        else:
            messages.error(request, "Invalid username or password") 
    context = {
        "title": "Login",
        "form": form,
    }
    return render(request, 'login.html', context)

def logout(request):
    auth.logout(request)
    return redirect('login')

# def verify_email(request, uidb64, token):
#     try:
#         uid = urlsafe_base64_decode(uidb64).decode()
#         user = Userdetails.objects.get(email=uid)
#     except(TypeError, ValueError, OverflowError, Userdetails.DoesNotExist):
#         user = None
#     if user is not None and default_token_generator.check_token(user, token):
#         user.verified = True
#         user.save()
#         messages.success(request, 'Email verified successfully.')
#     else:
#         messages.error(request, 'Email verification failed.')
#     return redirect('login')


def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Userdetails.objects.get(email=uid)
    except(TypeError, ValueError, OverflowError, Userdetails.DoesNotExist):
        user = None
    
    if user is not None and token == user.otp:
        user.verified = True
        user.otp = None
        user.save()
        messages.success(request, 'Email verified successfully.')
      
    else:
        messages.error(request, 'Email verification failed.')
    
    return redirect('login')

def pleaseverify(request):
    if request.user.is_authenticated:
        user= request.user
        user = Userdetails.objects.get(email=user.email)
        if user.verified:
            return redirect('')
    else:
        return redirect('login')    
    
    return render(request, 'ask-verify.html')

def resendverificationemail(request):
    user = request.user
    print(user)
    send_verification_email(user, request)
    messages.success(request, 'Verification email sent successfully.')
    return redirect('verification-email-sent')

def checkhandle(request,handle):
    
    data = {
        'is_taken': Userdetails.objects.filter(handle=handle).exists()
    }
    return JsonResponse(data)


def getstory(request):
    stories={
        '1':{
            'user':'niloynafis234@gmail.com',
            'image':'{{static "images/default-makle.jpg"}}',
        }
    }
    return render(request, 'story.html')


# ignore csrf token

@csrf_exempt

def updatepropic(request):
    if request.method == 'POST':
        user = request.user
        user = Userdetails.objects.get(email=user.email)
        print(request.FILES['image'])
        
        user.profile_pic = request.FILES['image']
        user.save()
        messages.success(request, 'Profile picture updated successfully.')
        return redirect('')
    return render(request, '')


# def createpost(request):
#     if request.method == 'POST':
#         user = request.user
#         user = Userdetails.objects.get(email=user.email)
#         handle= user.handle
#         email= user.email
#         text= request.POST.get('text')
#         if request.FILES.get('image'):
#             image= request.FILES['image']
#             if image:
#                 if text:
#                     post = Posts.objects.create(user=user, text=text, email=email, handle=handle, image=image)
#                     post.save()
#                 else:
#                     post = Posts.objects.create(user=user, email=email, handle=handle, image=image)
#                     post.save()
#             else:
#                 post = Posts.objects.create(user=user, text=text, email=email, handle=handle)
#                 post.save() 

#         else:
#                 post = Posts.objects.create(user=user, text=text, email=email, handle=handle)
#                 post.save() 
        
#         return redirect('')
#     return render(request, '')

def createpost(request):
    if request.method == 'POST':
        user = request.user
        user_details = Userdetails.objects.get(email=user.email)
        handle = user_details.handle
        email = user_details.email
        text = request.POST.get('text')

        if request.FILES.get('image'):
            image = request.FILES['image']
            if image:
                # Open the uploaded image using Pillow
                img = Image.open(image)
                
                # Resize the image to reduce its dimensions
                img.thumbnail((800, 800))  # Resize to maximum width/height of 800px
                
                # Reduce the quality to 60
                img.save(image.file, format='JPEG', quality=60 ,optimize=True)
                
                if text:
                    post = Posts.objects.create(user=user_details, text=text, email=email, handle=handle, image=image)
                    post.save()
                else:
                    post = Posts.objects.create(user=user_details, email=email, handle=handle, image=image)
                    post.save()
            else:
                post = Posts.objects.create(user=user_details, text=text, email=email, handle=handle)
                post.save()
        else:
            post = Posts.objects.create(user=user_details, text=text, email=email, handle=handle)
            post.save() 
        
        return redirect('')
    return render(request, '')

def get_posts(request,post_count):
    logged_in_user = request.user if request.user.is_authenticated else None
    post_count= int(post_count)
    custom_user= Userdetails.objects.get(email=logged_in_user.email)
    posts = Posts.objects.order_by('-date')[post_count-10:post_count]

        # Convert posts to a list of dictionaries
    posts_data = []
    comments_data = []

    for post in posts:

            if post.liked_by:
                # check if the user has liked the post already
                liked_by = post.liked_by.split(',')
                if logged_in_user.email in liked_by:
                    liked = True
                else:
                    liked = False
            else:
                liked = False
            # compare the date of the post with the current date
            formatted_time_difference = format_time_difference(post.date)

            if post.comments:
                comments = post.comments.split(',')
                print(comments)
                for comment_id in comments:
                  if comment_id.strip():
                    try:
                        comment = Comments_text.objects.get(comment_id=comment_id.strip())
                        print(comment)
                        comment_data = {
                                    'user': comment.user.name,
                                    'profile_pic': comment.user.profile_pic.url,
                                    'text': comment.text,
                                    'post_id': comment.post.post_id,
                                    'gender': comment.user.gender,
                                    'date': format_time_difference(comment.date),
                                    'comment_id': comment.comment_id
                                }
                        comments_data.append(comment_data)
                    except:
                        Comments_text.DoesNotExist
            if comments_data:
               comments_data = comments_data[::-1] 
            post_data = {
                'user': post.user.name,
                'profile_pic': post.user.profile_pic.url,
                'text': post.text,
                'gender': post.user.gender,
                'post_id': post.post_id,
                'likes': post.likes,
                'liked': liked,
                'comment_count': post.comment_count,
                
                'liked_by': post.liked_by.split(',') if post.liked_by else [],
                'comments': comments_data,
                'email': post.email,
                'handle': post.handle,
                'image': post.image.url if post.image else None,
                'date':  formatted_time_difference 
            }
            posts_data.append(post_data)
    context={
            'posts': posts_data,
            'custom_user': custom_user
        }

    return render(request, 'posts.html', context)


# def get_posts(request):
#     if request.method == 'GET':
#         # Assuming you want to get 10 most recent posts
#         posts = Posts.objects.order_by('-date')[:10]

#         # Convert posts to a list of dictionaries
#         posts_data = []
#         for post in posts:
#             post_data = {
#                 'user': post.user.name,
#                 'text': post.text,
#                 'likes': post.likes,
#                 'comment_count': post.comment_count,
#                 'liked_by': post.liked_by.split(',') if post.liked_by else [],
#                 'comments': post.comments.split(',') if post.comments else [],
#                 'email': post.email,
#                 'handle': post.handle,
#                 'image': post.image.url if post.image else None,
#                 'date': post.date.strftime('%Y-%m-%d %H:%M:%S')
#             }
#             posts_data.append(post_data)
#     context={
#             'posts': posts_data
#         }

#     return render(request, 'posts.html', context)


def like_post(request, post_id):
    if request.method == 'GET':
        post = Posts.objects.get(post_id=post_id)
        if request.user.email in post.liked_by.split(','):
            return JsonResponse({'message': 'You have already liked this post.'}, status=400)
        post.likes += 1
        post.liked_by += f',{request.user.email}'
        post.save()
        return JsonResponse({'message': 'Post liked successfully.'})
    
def unlike_post(request, post_id):
    if request.method == 'GET':
        post = Posts.objects.get(post_id=post_id)
        if request.user.email not in post.liked_by.split(','):
            return JsonResponse({'message': 'You have not liked this post.'}, status=400)
        post.likes -= 1
        liked_by = post.liked_by.split(',')
        liked_by.remove(request.user.email)
        post.liked_by = ','.join(liked_by)
        post.save()
        return JsonResponse({'message': 'Post unliked successfully.'})
    

def comment_post(request):
    if request.method == 'POST':
        post_id = request.POST.get('post_id')
        post = Posts.objects.get(post_id=post_id)
        user = request.user
        user = Userdetails.objects.get(email=user.email)
        text = request.POST.get('text')
        comment = Comments_text.objects.create(post=post, user=user, text=text)
        comment.save()
        post.comment_count += 1
        post.comments += f',{comment.comment_id}'
        post.save()
        return redirect('')    


def profile(request, handle):
    logged_in_user = request.user if request.user.is_authenticated else None
    if not logged_in_user:
        return redirect('login')
    custom_user_instance = Userdetails.objects.get(email=logged_in_user.email)
    if not custom_user_instance.verified:
        return redirect('verification-email-sent')
    
    user = Userdetails.objects.get(handle=handle)
    posts = Posts.objects.filter(user=user).order_by('-date')
    posts_data = []
    comments_data = []

    for post in posts:
            
            if post.liked_by:
                # check if the user has liked the post already
                liked_by = post.liked_by.split(',')
                if logged_in_user.email in liked_by:
                    liked = True
                else:
                    liked = False
            else:
                liked = False
            # compare the date of the post with the current date
            formatted_time_difference = format_time_difference(post.date)

            if post.comments:
                comments = post.comments.split(',')
                print(comments)
                for comment_id in comments:
                  if comment_id.strip():
                    try:
                        comment = Comments_text.objects.get(comment_id=comment_id.strip())
                        print(comment)
                        comment_data = {
                                    'user': comment.user.name,
                                    'profile_pic': comment.user.profile_pic.url,
                                    'text': comment.text,
                                    'post_id': comment.post.post_id,
                                    'gender': comment.user.gender,
                                    'date': format_time_difference(comment.date),
                                    'comment_id': comment.comment_id
                                }
                        comments_data.append(comment_data)
                    except:
                        Comments_text.DoesNotExist
            if comments_data:
               comments_data = comments_data[::-1] 
            post_data = {
                'user': post.user.name,
                'profile_pic': post.user.profile_pic.url,
                'text': post.text,
                'gender': post.user.gender,
                'post_id': post.post_id,
                'likes': post.likes,
                'liked': liked,
                'comment_count': post.comment_count,
                
                'liked_by': post.liked_by.split(',') if post.liked_by else [],
                'comments': comments_data,
                'email': post.email,
                'handle': post.handle,
                'image': post.image.url if post.image else None,
                'date':  formatted_time_difference 
            }
            posts_data.append(post_data)
    context = {
        "title": user.name + "'s Profile",
        "custom_user": custom_user_instance,  
        "profile_user": user,
        "posts": posts_data,
    }
    

    return render(request, 'profile.html', context)


def editprofile(request):
    if request.method == 'POST':
        user = request.user
        user = Userdetails.objects.get(email=user.email)
        user.name = request.POST.get('name')
        user.bio = request.POST.get('bio')
        user.location = request.POST.get('location')
        user.hobbies = request.POST.get('hobbies')
        user.contact_info = request.POST.get('contact_info')
        user.save()
        messages.success(request, 'Profile updated successfully.')
        return redirect('profile', handle=user.handle)
    context={
        'custom_user': Userdetails.objects.get(email=request.user.email),
        'profile_user': Userdetails.objects.get(email=request.user.email),
    }

 
    return render(request, 'edit-profile.html',context)

def getlocationsuggestions(request):
    if request.method == 'GET':
        with open('worldcities.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            cities = []
            for row in reader:
                for field in row:

                    if request.GET.get('q').lower() in field.lower():
                        city = ', '.join(row)
                        cities.append(city)
                        cities = cities[0:4]
            print(cities)
            return JsonResponse({'cities': cities})