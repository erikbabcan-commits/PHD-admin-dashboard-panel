
import { Injectable, signal, inject, computed } from '@angular/core';
import { UserProfile } from '../models';
import { SalonDataService } from '../data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dataService = inject(SalonDataService);

  private _loggedInUserId = signal<string | null>(null);

  public readonly currentUser = computed(() => {
    const userId = this._loggedInUserId();
    if (!userId) {
      return null;
    }
    // This will react to changes in dataService.users() because it's a signal
    return this.dataService.users().find(u => u.uid === userId) || null;
  });

  simulateLogin(userId: string) {
    this._loggedInUserId.set(userId);
    // No need to explicitly fetch here, computed will handle it
    // Add a check to ensure the user exists after login attempt
    if (!this.dataService.getUser(userId)) {
       console.error(`Login failed: User with ID ${userId} not found.`);
    }
  }

  logout() {
    this._loggedInUserId.set(null);
  }
}