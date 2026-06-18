import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Property } from '../models/property.model';

const MOCK_PROPERTIES: Property[] = [
  {
    _id: '1',
    title: 'Spacious Family Home with Modern Interior',
    description: 'A stunning family home featuring a beautifully furnished living room with yellow accent chairs, a large flat-screen TV, and an open patio. Perfect for entertaining and comfortable daily living.',
    price: 1850000,
    city: 'Johannesburg',
    country: 'South Africa',
    propertyType: 'House',
    imageUrls: ['images/living-room.jpg'],
    owner: { username: 'PropSpace Agent' }
  },
  {
    _id: '2',
    title: 'Modern Townhouse Complex - Prime Location',
    description: 'Elegant brick townhouse in a secure complex with cobblestone driveways, teal balconies, and garages. Walking distance to local amenities. Ideal for young professionals and families.',
    price: 2400000,
    city: 'Pretoria',
    country: 'South Africa',
    propertyType: 'Townhouse',
    imageUrls: ['images/townhouse.jpg'],
    owner: { username: 'PropSpace Agent' }
  },
  {
    _id: '3',
    title: 'Charming Brick House with Garden',
    description: 'A warm and inviting brick home with a lush garden, paved driveway, and beautifully landscaped front yard. Features a wooden gate entrance and large windows for natural light.',
    price: 1250000,
    city: 'Soweto',
    country: 'South Africa',
    propertyType: 'House',
    imageUrls: ['images/house-exterior.jpg'],
    owner: { username: 'PropSpace Agent' }
  },
  {
    _id: '4',
    title: 'Luxury Townhouse with Teal Balconies',
    description: 'Premium townhouse development featuring unique teal accent balconies, terracotta brick facade, and cobblestone community driveway. Secure, stylish, and ready to move in.',
    price: 3100000,
    city: 'Sandton',
    country: 'South Africa',
    propertyType: 'Townhouse',
    imageUrls: ['images/property2.png'],
    owner: { username: 'PropSpace Agent' }
  },
  {
    _id: '5',
    title: 'Elegant Home - Perfect Starter Property',
    description: 'Beautifully maintained starter home featuring a warm orange brick exterior, manicured lawn and garden beds, paved entry, and a charming curb appeal.',
    price: 980000,
    city: 'Cape Town',
    country: 'South Africa',
    propertyType: 'House',
    imageUrls: ['images/house-exterior.jpg'],
    owner: { username: 'PropSpace Agent' }
  },
  {
    _id: '6',
    title: 'Open-Plan Living Room - Rental Property',
    description: 'Stylishly furnished open-plan property available for rent. Features tile floors, large TV setup, golden accent chairs, and sliding doors to an outdoor patio.',
    price: 12500,
    city: 'Durban',
    country: 'South Africa',
    propertyType: 'Apartment',
    imageUrls: ['images/living-room.jpg'],
    owner: { username: 'PropSpace Agent' }
  }
];

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:5000/api/properties';
  private readonly storageKey = 'propspace_properties';

  constructor(private http: HttpClient) {}

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl).pipe(
      map(properties => properties?.length ? properties : this.getLocalProperties()),
      tap(properties => this.saveLocalProperties(properties)),
      catchError(() => of(this.getLocalProperties()))
    );
  }

  getFilteredProperties(city?: string, minPrice?: number, maxPrice?: number): Observable<Property[]> {
    const params: any = {};
    if (city) params.city = city;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    return this.http.get<Property[]>(this.apiUrl, { params }).pipe(
      map(properties => properties?.length ? properties : this.filterProperties(this.getLocalProperties(), city, minPrice, maxPrice)),
      catchError(() => of(this.filterProperties(this.getLocalProperties(), city, minPrice, maxPrice)))
    );
  }

  getMyListings(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/my-listings`).pipe(
      map(properties => properties?.length ? properties : this.getLocalProperties().filter(property => this.isOwnedLocally(property))),
      catchError(() => of(this.getLocalProperties().filter(property => this.isOwnedLocally(property))))
    );
  }

  getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(this.getLocalProperties().find(property => property._id === id) || this.getLocalProperties()[0]))
    );
  }

  createProperty(data: Property): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, data).pipe(
      tap(property => this.upsertLocalProperty(property)),
      catchError(() => of(this.createLocalProperty(data)))
    );
  }

  updateProperty(id: string, data: Property): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, data).pipe(
      tap(property => this.upsertLocalProperty({ ...property, _id: property._id || id })),
      catchError(() => of(this.updateLocalProperty(id, data)))
    );
  }

  deleteProperty(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.deleteLocalProperty(id)),
      catchError(() => {
        this.deleteLocalProperty(id);
        return of({ message: 'Property deleted locally' });
      })
    );
  }

  private getLocalProperties(): Property[] {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.length) {
        return saved;
      }
    }

    const seeded = MOCK_PROPERTIES.map((property, index) => ({
      ...property,
      owner: index < 3 ? this.getCurrentUser() : property.owner
    }));
    this.saveLocalProperties(seeded);
    return seeded;
  }

  private saveLocalProperties(properties: Property[]): void {
    if (properties?.length) {
      localStorage.setItem(this.storageKey, JSON.stringify(properties));
    }
  }

  private createLocalProperty(data: Property): Property {
    const property: Property = {
      ...data,
      _id: `local-property-${Date.now()}`,
      imageUrls: data.imageUrls?.length ? data.imageUrls : ['images/house-exterior.jpg'],
      owner: this.getCurrentUser()
    };
    this.saveLocalProperties([property, ...this.getLocalProperties()]);
    return property;
  }

  private updateLocalProperty(id: string, data: Property): Property {
    const properties = this.getLocalProperties();
    const current = properties.find(property => property._id === id);
    const updated: Property = {
      ...current,
      ...data,
      _id: id,
      imageUrls: data.imageUrls?.length ? data.imageUrls : current?.imageUrls || ['images/house-exterior.jpg'],
      owner: current?.owner || this.getCurrentUser()
    } as Property;

    this.saveLocalProperties(properties.map(property => property._id === id ? updated : property));
    return updated;
  }

  private upsertLocalProperty(property: Property): void {
    const properties = this.getLocalProperties();
    const exists = properties.some(item => item._id === property._id);
    this.saveLocalProperties(exists
      ? properties.map(item => item._id === property._id ? property : item)
      : [property, ...properties]
    );
  }

  private deleteLocalProperty(id: string): void {
    this.saveLocalProperties(this.getLocalProperties().filter(property => property._id !== id));
  }

  private filterProperties(properties: Property[], city?: string, minPrice?: number, maxPrice?: number): Property[] {
    return properties.filter(property => {
      const cityMatch = !city || property.city.toLowerCase().includes(city.toLowerCase());
      const minMatch = !minPrice || property.price >= minPrice;
      const maxMatch = !maxPrice || property.price <= maxPrice;
      return cityMatch && minMatch && maxMatch;
    });
  }

  private isOwnedLocally(property: Property): boolean {
    const user = this.getCurrentUser();
    return property.owner?._id === user._id || property.owner?.email === user.email;
  }

  private getCurrentUser(): any {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : {
      _id: 'local-user-demo',
      username: 'PropSpace User',
      email: 'demo@propspace.local'
    };
  }
}




