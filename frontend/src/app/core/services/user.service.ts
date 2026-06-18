import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';
  private readonly userKey = 'user';
  private readonly usersKey = 'propspace_users';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      catchError(() => of(this.getLocalProfile()))
    );
  }

  updateProfile(data: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, data).pipe(
      tap(user => this.saveLocalProfile(user)),
      catchError(() => of(this.saveLocalProfile({ ...this.getLocalProfile(), ...data })))
    );
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, data).pipe(
      catchError(() => {
        const profile: any = this.getLocalProfile();
        const users = this.getLocalUsers().map((user: any) =>
          user._id === profile._id ? { ...user, password: data.newPassword } : user
        );
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        return of({ message: 'Password changed locally' });
      })
    );
  }

  private getLocalProfile(): User {
    const raw = localStorage.getItem(this.userKey);

    if (raw) {
      return JSON.parse(raw);
    }

    const guest: User = {
      _id: 'local-user-demo',
      username: 'PropSpace User',
      email: 'demo@propspace.local',
      phone: '',
      avatar: ''
    } as User;

    localStorage.setItem(this.userKey, JSON.stringify(guest));
    localStorage.setItem('token', 'local-demo-token-local-user-demo');
    return guest;
  }

  private saveLocalProfile(user: User): User {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    const users = this.getLocalUsers();
    const nextUsers = users.some((item: any) => item._id === (user as any)._id)
      ? users.map((item: any) => item._id === (user as any)._id ? { ...item, ...user } : item)
      : [...users, user];
    localStorage.setItem(this.usersKey, JSON.stringify(nextUsers));
    return user;
  }

  private getLocalUsers(): any[] {
    const raw = localStorage.getItem(this.usersKey);
    return raw ? JSON.parse(raw) : [];
  }
}
