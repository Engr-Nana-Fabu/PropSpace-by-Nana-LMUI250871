import { Routes } from '@angular/router';

import { authGuard }
from './core/guards/auth.guard';

import { LoginComponent }
from '../../features/auth/login/login.component';

import { RegisterComponent }
from '../../features/auth/register/register.component';

import { DashboardComponent }
from '../../features/dashboard/dashboard.component';

import { ProfileComponent }
from '../../features/profile/profile.component';

import { PropertyListComponent }
from '../../features/properties/property-list/property-list.component';

import { PropertyFormComponent }
from '../../features/properties/property-form/property-form.component';

import { EditPropertyComponent }
from '../../features/properties/edit-property/edit-property.component';

import { MyListingsComponent }
from '../../features/properties/my-listings/my-listings.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo:
      'properties',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component:
      LoginComponent
  },

  {
    path: 'register',
    component:
      RegisterComponent
  },

  {
    path: 'dashboard',
    component:
      DashboardComponent,
    canActivate: [
      authGuard
    ]
  },

  {
    path: 'profile',
    component:
      ProfileComponent,
    canActivate: [
      authGuard
    ]
  },

  {
    path: 'properties',
    component:
      PropertyListComponent
  },

  {
    path: 'create-property',
    component:
      PropertyFormComponent,
    canActivate: [
      authGuard
    ]
  },
  {
    path: 'my-listings',
    component:
      MyListingsComponent,
    canActivate: [
      authGuard
    ]
  },

  {
    path: 'edit-property/:id',
    component:
      EditPropertyComponent,
    canActivate: [
      authGuard
    ]
  },

  {
    path: '**',
    redirectTo:
      'properties'
  }
];
