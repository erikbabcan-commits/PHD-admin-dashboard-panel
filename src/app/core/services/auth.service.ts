import { Injectable, signal, inject } from '@angular/core';
import { UserProfile } from '../models';
import { SalonDataService } from '../data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dataService = inject(SalonDataService);

  private _currentUser = signal<UserProfile | null>(null);
  public readonly currentUser = this._currentUser.asReadonly();

  simulateLogin(userId: string) {
    const user = this.dataService.getUser(userId);
    if (user) {
      this._currentUser.set(user);
    } else {
      console.error(`Login failed: User with ID ${userId} not found.`);
    }
  }

  logout() {
    this._currentUser.set(null);
  }
}
