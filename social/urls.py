from . import views
from django.contrib import admin
from django.urls import path , re_path
from django.views.generic import RedirectView

from django.views.static import serve
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name=""),
    path('register/', views.register, name="register"), 
    path('login/', views.login, name="login"),
    path('logout/', views.logout, name="logout"),
    path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email'),
    path('verification-email-sent/', views.pleaseverify, name='verification-email-sent'),
    path('resend-verification-email/', views.resendverificationemail, name='resend-verification-email'),
    path('checkhandle/<handle>', views.checkhandle, name='checkhandle'),
    path('updatepropic/', views.updatepropic, name='updatepropic'),
    path('createpost/', views.createpost, name='createpost'),
    path('get_posts/<post_count>', views.get_posts, name='get_posts'),
    path('like_post/<post_id>', views.like_post, name='like_post'),
    path('unlike_post/<post_id>', views.unlike_post, name='unlike_post'),
    path('comment_post/', views.comment_post, name='comment_post'),
    path('profile/@<handle>', views.profile, name='profile'),
    path('@<handle>', views.profile, name='profile'),
    path('editprofile/', views.editprofile, name='editprofile'),
    path('getlocationsuggestions/', views.getlocationsuggestions, name='getlocationsuggestions'),
]

if settings.DEBUG:
    urlpatterns += [
        path('profile_pics/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
