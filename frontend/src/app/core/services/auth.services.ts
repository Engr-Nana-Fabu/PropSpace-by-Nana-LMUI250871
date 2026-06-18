import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface LocalUser {
  _id: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private readonly usersKey = 'propspace_users';
  private readonly userKey = 'user';
  private readonly tokenKey = 'token';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError(() => of(this.registerLocally(data)))
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => this.persistSession(response)),
      catchError(() => of(this.loginLocally(data)))
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): LocalUser | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  private registerLocally(data: any): any {
    const users = this.getLocalUsers();
    const existing = users.find(user => user.email.toLowerCase() === data.email.toLowerCase());

    if (existing) {
      return { message: 'Account already exists locally. Please sign in.' };
    }

    const user: LocalUser = {
      _id: `local-user-${Date.now()}`,
      username: data.username,
      email: data.email,
      password: data.password,
      phone: '',
      avatar: ''
    };

    localStorage.setItem(this.usersKey, JSON.stringify([...users, user]));
    return { message: 'Local account created', user: this.stripPassword(user) };
  }

  private loginLocally(data: any): any {
    let users = this.getLocalUsers();
    let user = users.find(item => item.email.toLowerCase() === data.email.toLowerCase());

    if (!user) {
      user = {
        _id: `local-user-${Date.now()}`,
        username: data.email.split('@')[0] || 'PropSpace User',
        email: data.email,
        password: data.password,
        phone: '',
        avatar: ''
      };
      users = [...users, user];
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    const response = {
      token: `local-demo-token-${user._id}`,
      user: this.stripPassword(user)
    };

    this.persistSession(response);
    return response;
  }

  private persistSession(response: any): void {
    if (response?.token) {
      this.saveToken(response.token);
    }

    if (response?.user) {
      localStorage.setItem(this.userKey, JSON.stringify(response.user));
    }
  }

  private getLocalUsers(): LocalUser[] {
    const raw = localStorage.getItem(this.usersKey);
    return raw ? JSON.parse(raw) : [];
  }

  private stripPassword(user: LocalUser): LocalUser {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
