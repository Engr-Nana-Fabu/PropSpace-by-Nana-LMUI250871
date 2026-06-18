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
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl:
    './register.component.html'
})
export class RegisterComponent {

  registerForm: FormGroup;

  loading = false;

  error = '';

  constructor(
    private fb: FormBuilder,
    private authService:
      AuthService,
    private router: Router
  ) {

    this.registerForm =
      this.fb.group({

        username: [
          '',
          Validators.required
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ]
      });
  }

  onSubmit(): void {

    if (
      this.registerForm.invalid
    ) {
      return;
    }

    this.loading = true;

    this.authService
      .register(
        this.registerForm.value
      )
      .subscribe({

        next: (response: any) => {

          this.loading =
            false;

          this.router.navigate([
            '/login'
          ]);
        },

        error: (err: any) => {

          this.loading =
            false;

          this.error =
            err.error?.message ||
            'Registration failed';
        }
      });
  }
}