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
} from '../../src/app/core/services/property.service';

import {
  AuthService
} from '../../src/app/core/services/auth.services';

import {
  PropertyCardComponent
} from '../../shared/components/property-card/property-card.component';

@Component({
  selector:
    'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    PropertyCardComponent
  ],

  templateUrl:
    './dashboard.component.html'
})
export class DashboardComponent
implements OnInit, OnDestroy {

  myListings: any[] = [];

  loading = true;

  error = '';

  userName = '';

  private destroy$ =
    new Subject<void>();

  constructor(
    private propertyService:
      PropertyService,

    private authService:
      AuthService
  ) {

    const user =
      localStorage.getItem(
        'user'
      );

    if (user) {

      const userData =
        JSON.parse(user);

      this.userName =
        userData.username;
    }
  }

  ngOnInit(): void {

    this.loadMyListings();
  }

  loadMyListings(): void {

    this.propertyService
      .getMyListings()
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({

        next: (data) => {

          this.myListings =
            data;

          this.loading =
            false;
        },

        error: () => {

          this.error =
            'Failed to load your listings';

          this.loading =
            false;
        }
      });
  }

  logout(): void {

    this.authService
      .logout();

    localStorage.removeItem(
      'user'
    );
  }

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }
}