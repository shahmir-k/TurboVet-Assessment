import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginDto, LoginResponseDto } from '@org/data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api';

  // Signals for reactive state
  isAuthenticated = signal(false);
  currentUser = signal<LoginResponseDto['user'] | null>(null);

  constructor() {
    // Check if user is already logged in
    this.checkAuth();
  }

  private checkAuth() {
    const token = this.getToken();
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      this.isAuthenticated.set(true);
      this.currentUser.set(JSON.parse(userStr));
    }
  }

  login(loginDto: LoginDto): Observable<LoginResponseDto> {
    return this.http
      .post<LoginResponseDto>(`${this.apiUrl}/auth/login`, loginDto)
      .pipe(
        tap((response) => {
          // Store token and user info
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          // Update signals
          this.isAuthenticated.set(true);
          this.currentUser.set(response.user);
        })
      );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isOwnerOrAdmin(): boolean {
    const user = this.currentUser();
    return user?.roleType === 'owner' || user?.roleType === 'admin';
  }

  isViewer(): boolean {
    return this.currentUser()?.roleType === 'viewer';
  }
}

