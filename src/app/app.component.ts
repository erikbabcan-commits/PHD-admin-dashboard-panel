import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  template: `
    <main class="bg-brand-dark text-brand-light min-h-screen antialiased">
      <router-outlet></router-outlet>
      <app-notification></app-notification>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);

  constructor() {
    this.authService.simulateLogin('user-1'); // Auto-login a default user
  }
}
