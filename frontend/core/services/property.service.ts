import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl =
    'http://localhost:5000/api/properties';

  constructor(
    private http: HttpClient
  ) {}

  getProperties():
  Observable<any> {

    return this.http.get(
      this.apiUrl
    );
  }

  getMyListings():
  Observable<any> {

    return this.http.get(
      `${this.apiUrl}/my-listings`
    );
  }

  createProperty(
    data: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );
  }

  updateProperty(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteProperty(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}