import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PropertyService } from '../../../src/app/core/services/property.service';
import { Property } from '../../../src/app/core/models/property.model';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PropertyCardComponent],
  templateUrl: './property-list.component.html'
})
export class PropertyListComponent implements OnInit, OnDestroy {

  properties: Property[] = [];
  filteredProperties: Property[] = [];
  loading = true;
  error = '';
  searchCity = '';
  selectedType = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  menuOpen = false;

  private destroy$ = new Subject<void>();

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getProperties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.properties = data;
          this.filteredProperties = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load properties';
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.filteredProperties = this.properties.filter(p => {
      const cityMatch = !this.searchCity ||
        p.city.toLowerCase().includes(this.searchCity.toLowerCase()) ||
        p.title.toLowerCase().includes(this.searchCity.toLowerCase());
      const typeMatch = !this.selectedType || p.propertyType === this.selectedType;
      const minMatch = !this.minPrice || p.price >= this.minPrice;
      const maxMatch = !this.maxPrice || p.price <= this.maxPrice;
      return cityMatch && typeMatch && minMatch && maxMatch;
    });
  }

  clearFilters(): void {
    this.searchCity = '';
    this.selectedType = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.filteredProperties = [...this.properties];
  }

  formatPrice(price: number): string {
    if (price < 20000) return `R ${price.toLocaleString()}/mo`;
    return `R ${price.toLocaleString()}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}