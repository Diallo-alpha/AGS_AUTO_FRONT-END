import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserModel, LoginResponse } from './../models/userModel';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserModel | null>;
  public currentUser: Observable<UserModel | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserModel | null>(this.getUserFromLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromLocalStorage(): UserModel | null {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        return null;
      }
    }
    return null;
  }

  public get currentUserValue(): UserModel | null {
    return this.currentUserSubject.value;
  }

  register(user: UserModel): Observable<any> {
    return this.http.post(`${apiUrl}/register`, user).pipe(
      tap(response => this.setUserData(response as LoginResponse)),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${apiUrl}/login`, { email, password }).pipe(
      tap(response => this.setUserData(response as LoginResponse)),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${apiUrl}/logout`, {}).pipe(
      tap(() => this.clearUserData()),
      catchError(this.handleError)
    );
  }

  public clearUserData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${apiUrl}/refresh`, {}).pipe(
      tap(response => this.setUserData(response as LoginResponse)),
      catchError(this.handleError)
    );
  }

  updateProfile(userData: Partial<UserModel>): Observable<any> {
    return this.http.patch(`${apiUrl}/update`, userData).pipe(
      tap(updatedUser => {
        const currentUser = this.currentUserValue;
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedUser };
          this.currentUserSubject.next(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${apiUrl}/delete`).pipe(
      tap(() => this.clearUserData()),
      catchError(this.handleError)
    );
  }

  private setUserData(response: LoginResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error?.message || 'Server error'));
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === 'admin';
  }

  isEtudiant(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === 'etudiant';
  }
}
