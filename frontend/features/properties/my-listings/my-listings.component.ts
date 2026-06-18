import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  PropertyService
} from '../../../src/app/core/services/property.service';

import {
  Property
} from '../../../src/app/core/models/property.model';

import {
  PropertyCardComponent
} from '../../../shared/components/property-card/property-card.component';

@Component({
  selector:
    'app-my-listings',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    PropertyCardComponent
  ],

  templateUrl:
    './my-listings.component.html'
})
export class MyListingsComponent
implements OnInit, OnDestroy {

  properties: Property[] = [];

  loading = true;

  private destroy$ =
    new Subject<void>();

  constructor(
    private propertyService:
      PropertyService
  ) {}

  ngOnInit(): void {

    this.propertyService
      .getMyListings()
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({

        next: (data: any) => {

          this.properties =
            data;

          this.loading =
            false;
        },

        error: () => {

          this.loading =
            false;
        }
      });
  }

  deleteProperty(
    id: string
  ): void {

    if (confirm(
      'Are you sure you want to delete this property?'
    )) {

      this.propertyService
        .deleteProperty(id)
        .subscribe(() => {

          this.properties =
            this.properties.filter(
              p => p._id !== id
            );
        });
    }
  }

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }
}