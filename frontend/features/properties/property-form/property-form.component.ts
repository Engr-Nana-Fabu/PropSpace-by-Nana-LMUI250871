import {
  Component,
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
  Router,
  RouterLink
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  PropertyService
} from '../../../src/app/core/services/property.service';

@Component({
  selector:
    'app-property-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './property-form.component.html'
})
export class PropertyFormComponent
implements OnDestroy {

  loading = false;

  error = '';

  successMessage = '';

  propertyForm: FormGroup;

  propertyTypes = [
    'Apartment',
    'House',
    'Studio'
  ];

  private destroy$ =
    new Subject<void>();

  constructor(
    private fb:
      FormBuilder,

    private propertyService:
      PropertyService,

    private router:
      Router
  ) {

    this.propertyForm =
      this.fb.group({

        title: [
          '',
          Validators.required
        ],

        description: [
          '',
          Validators.required
        ],

        city: [
          '',
          Validators.required
        ],

        country: [
          '',
          Validators.required
        ],

        price: [
          '',
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        propertyType: [
          '',
          Validators.required
        ],

        imageUrls: ['']
      });
  }

  onSubmit(): void {

    if (
      this.propertyForm.invalid
    ) {
      return;
    }

    this.loading = true;

    this.error = '';

    const formValue =
      this.propertyForm.value;

    const imageUrls =
      formValue.imageUrls
        ? formValue
            .imageUrls
            .split(',')
            .map(
              (url: string) =>
                url.trim()
            )
        : [];

    const payload = {

      ...formValue,

      imageUrls,

      price: parseFloat(
        formValue.price
      )
    };

    this.propertyService
      .createProperty(
        payload
      )
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({

        next: () => {

          this.loading =
            false;

          this.successMessage =
            'Property created successfully!';

          setTimeout(
            () => {

              this.router.navigate([
                '/my-listings'
              ]);
            },
            1500
          );
        },

        error: (err: any) => {

          this.loading =
            false;

          this.error =
            err.error?.message ||
            'Failed to create property';
        }
      });
  }

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }
}