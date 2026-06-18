import {
  Component,
  OnInit
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
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  PropertyService
} from '../../../src/app/core/services/property.service';

@Component({
  selector:
    'app-edit-property',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './edit-property.component.html'
})
export class EditPropertyComponent
implements OnInit {

  propertyId = '';

  loading = true;

  propertyForm: FormGroup;

  error = '';

  constructor(
    private fb:
      FormBuilder,

    private route:
      ActivatedRoute,

    private router:
      Router,

    private propertyService:
      PropertyService
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
          Validators.required
        ],

        propertyType: [
          '',
          Validators.required
        ]
      });
  }

  ngOnInit(): void {

    this.propertyId =
      this.route.snapshot.params[
        'id'
      ];

    this.propertyService
      .getPropertyById(
        this.propertyId
      )
      .subscribe({

        next: (property: any) => {

          this.propertyForm.patchValue(
            property
          );

          this.loading =
            false;
        },

        error: (err: any) => {

          this.loading =
            false;

          this.error =
            err.error?.message ||
            'Failed to load property';
        }
      });
  }

  onSubmit(): void {

    if (
      this.propertyForm.invalid
    ) {
      return;
    }

    this.loading = true;

    this.propertyService
      .updateProperty(
        this.propertyId,
        this.propertyForm.value
      )
      .subscribe({

        next: (response: any) => {

          this.loading =
            false;

          this.router.navigate([
            '/my-listings'
          ]);
        },

        error: (err: any) => {

          this.loading =
            false;

          this.error =
            err.error?.message ||
            'Failed to update property';
        }
      });
  }
}