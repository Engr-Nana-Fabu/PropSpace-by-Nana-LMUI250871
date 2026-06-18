import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  UserService
} from '../../src/app/core/services/user.service';

@Component({
  selector:
    'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './profile.component.html'
})
export class ProfileComponent
implements OnInit, OnDestroy {

  profileForm: FormGroup;

  passwordForm: FormGroup;

  user: any;

  loading = true;

  updateLoading = false;

  passwordLoading = false;

  error = '';

  successMessage = '';

  activeTab =
    'profile';

  private destroy$ =
    new Subject<void>();

  constructor(
    private userService:
      UserService,

    private fb:
      FormBuilder
  ) {

    this.profileForm =
      this.fb.group({

        username: [
          '',
          Validators.required
        ],

        phone: [''],

        avatar: ['']
      });

    this.passwordForm =
      this.fb.group({

        oldPassword: [
          '',
          Validators.required
        ],

        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ]
      });
  }

  ngOnInit(): void {

    this.loadProfile();
  }

  loadProfile(): void {

    this.userService
      .getProfile()
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({

        next: (data: any) => {

          this.user = data;

          this.profileForm.patchValue({
            username:
              data.username,

            phone:
              data.phone,

            avatar:
              data.avatar
          });

          this.loading =
            false;
        },

        error: () => {

          this.error =
            'Failed to load profile';

          this.loading =
            false;
        }
      });
  }

  updateProfile(): void {

    if (
      this.profileForm.invalid
    ) {
      return;
    }

    this.updateLoading = true;

    this.userService
      .updateProfile(
        this.profileForm.value
      )
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Profile updated successfully';

          this.updateLoading =
            false;

          setTimeout(
            () => {

              this.successMessage =
                '';
            },
            3000
          );
        },

        error: () => {

          this.error =
            'Failed to update profile';

          this.updateLoading =
            false;
        }
      });
  }

  changePassword(): void {

    if (
      this.passwordForm.invalid
    ) {
      return;
    }

    this.passwordLoading = true;

    this.userService
      .changePassword(
        this.passwordForm.value
      )
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Password changed successfully';

          this.passwordForm.reset();

          this.passwordLoading =
            false;

          setTimeout(
            () => {

              this.successMessage =
                '';
            },
            3000
          );
        },

        error: (err: any) => {

          this.error =
            err.error?.message ||
            'Failed to change password';

          this.passwordLoading =
            false;
        }
      });
  }

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }
}