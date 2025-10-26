
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service'; // Changed to direct file import

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  notification = this.notificationService.notification;

  icon = computed(() => {
    switch (this.notification()?.type) {
      case 'success': return 'M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error': return 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z';
      case 'info': return 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z';
      default: return '';
    }
  });

  colorClasses = computed(() => {
    switch (this.notification()?.type) {
      case 'success': return 'bg-green-500/90 border-green-400';
      case 'error': return 'bg-red-500/90 border-red-400';
      case 'info': return 'bg-blue-500/90 border-blue-400';
      default: return 'bg-gray-700/90 border-gray-600';
    }
  });

  close() {
    this.notificationService.clear();
  }
}