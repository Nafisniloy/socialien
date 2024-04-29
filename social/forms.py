from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.forms.widgets import PasswordInput, TextInput
from django import forms
from django.contrib.auth import authenticate



class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(label='Email', required=True)
    date_of_birth = forms.DateField(label='Date of Birth', required=True)
    handle = forms.CharField(label='Handle', required=True)
    name= forms.CharField(label='Name', required=True)

    class Meta:
        model = User
        fields = ['name','email', 'password1', 'password2', 'date_of_birth', 'handle']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already in use. Please use a different email.")
        return email

    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.username = user.email  # Use email as username
        user.name= self.cleaned_data['name']
        user.email = self.cleaned_data['email']
        user.date_of_birth = self.cleaned_data['date_of_birth']
        user.handle = self.cleaned_data['handle']
        if commit:
            user.save()
        return user
    

class CustomAuthenticationForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ['username', 'password']
        widgets = {
            'username': TextInput(attrs={'class': 'form-control'}),
            'password': PasswordInput(attrs={'class': 'form-control'}),
        }