
import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notification = signal<Notification | null>(null);
  public readonly notification = this._notification.asReadonly();
  
  private timeoutId: any;

  show(message: string, type: NotificationType = 'info', duration: number = 4000) {
    this._notification.set({ message, type });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      this.clear();
    }, duration);
  }

  clear() {
    this._notification.set(null);
    if(this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }
  }
}
