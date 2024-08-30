import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
alertClass: string = ''
  responseMessage: string = ''
  loggedIn: boolean = false
  loginForm: FormGroup
  username: any
  email: any
  password: any

  constructor(private fb: FormBuilder, private authService: AuthService) {
    if (authService.checkToken()) {
      this.alertClass = 'alert alert-primary'
      this.responseMessage = 'Logged In'
      this.loggedIn = true
    }

    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })

    this.username = this.loginForm.get("username")
    this.email = this.loginForm.get("email")
    this.password = this.loginForm.get("password")
  }

  onSubmitHandler() {
    this.authService.register(this.loginForm.value).subscribe(
      (response) => {
        console.log(response.text)
        this.alertClass='alert alert-success'
        this.responseMessage = 'Registration successful.'
        localStorage.setItem('token', response)
        this.loggedIn = true
      }, (err) => {
        console.log(err)
        this.alertClass='alert alert-danger'
        this.responseMessage = 'Registration failed. Please try again.'
        this.loggedIn = false
      }
    )
  }
}
