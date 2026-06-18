import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl =
    'http://localhost:5000/api/users';

  constructor(
    private http: HttpClient
  ) {}

  getProfile() {

    return this.http.get(
      `${this.apiUrl}/profile`
    );
  }

  updateProfile(
    data: any
  ) {

    return this.http.put(
      `${this.apiUrl}/profile`,
      data
    );
  }

  changePassword(
    data: any
  ) {

    return this.http.put(
      `${this.apiUrl}/change-password`,
      data
    );
  }
}