import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  alertClass: string = ''
  responseMessage: string = ''
  loggedIn: boolean = false
  loginForm: FormGroup
  usernameOrEmail: any
  password: any

  constructor(private fb: FormBuilder, private authService: AuthService) {
    if (authService.checkToken()) {
      this.alertClass = 'alert alert-primary'
      this.responseMessage = 'Logged In'
      this.loggedIn = true
    }

    this.loginForm = this.fb.group({
      usernameOrEmail: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })

    this.usernameOrEmail = this.loginForm.get("usernameOrEmail")
    this.password = this.loginForm.get("password")
  }

  onSubmitHandler() {
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        console.log(response)
        this.alertClass = 'alert alert-success'
        this.responseMessage = 'Login successful.'
        localStorage.setItem('token', response)
        this.loggedIn = true
      },
      (err) => {
        console.error(err); // Ensure errors are properly logged
        this.alertClass = 'alert alert-danger'
        this.responseMessage = 'Login failed. Please try again.'
        this.loggedIn = false
      }
    )
  }
  
}
