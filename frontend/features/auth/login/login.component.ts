import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService }
from '../../../src/app/core/services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup;

  loading = false;

  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm =
      this.fb.group({
        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],
        password: [
          '',
          Validators.required
        ]
      });
  }

  onSubmit(): void {

    if (
      this.loginForm.invalid
    ) {
      return;
    }

    this.loading = true;

    this.error = '';

    this.authService
      .login(
        this.loginForm.value
      )
      .subscribe({

        next: (response: any) => {

          this.authService
            .saveToken(
              response.token
            );

          localStorage.setItem(
            'user',
            JSON.stringify(
              response.user
            )
          );

          this.loading =
            false;

          this.router.navigate([
            '/dashboard'
          ]);
        },

        error: (err: any) => {

          this.loading =
            false;

          this.error =
            err.error?.message ||
            'Login failed';
        }
      });
  }
}