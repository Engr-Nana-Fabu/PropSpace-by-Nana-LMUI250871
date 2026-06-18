import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  Property
} from '../../../src/app/core/models/property.model';

@Component({
  selector:
    'app-property-card',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './property-card.component.html'
})
export class PropertyCardComponent {

  @Input()
  property!: Property;
}