import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  isSidebarOpen = signal(true);

  navItems = [
    { path: 'overview', icon: 'M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.012-1.244h3.859M12 3v10.25m0 0a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z', label: 'Prehľad' },
    { path: 'calendar', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z', label: 'Kalendár' },
    { path: 'clients', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4 4 0 014.893 2.722 3 3 0 01-4.682-2.722M12 12a4 4 0 100-8 4 4 0 000 8zM12 15a9 9 0 100-18 9 9 0 000 18z', label: 'Klienti' },
    { path: 'products', icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM11.25 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z', label: 'Produkty' },
    { path: 'services', icon: 'M9.25 2.25a.75.75 0 00-1.5 0v1.518a25.996 25.996 0 00-4.906 4.343.75.75 0 00.446 1.286A23.493 23.493 0 018.5 8.166a23.493 23.493 0 014.256-.32.75.75 0 00.446-1.286A25.996 25.996 0 008.5 3.768V2.25zM12.508 11.035a.75.75 0 00-1.016.299A22.463 22.463 0 018.5 16.002a22.463 22.463 0 01-2.992-4.668.75.75 0 10-1.315.752A23.963 23.963 0 008.5 17.502a23.963 23.963 0 004.315-5.417.75.75 0 00-.297-1.05z', label: 'Služby'},
    { path: 'stylists', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12A3 3 0 1012 6a3 3 0 000 6z', label: 'Stylisti'},
    { path: 'gallery-admin', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z', label: 'Galéria'},
    { path: 'content-ideas', icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a12.06 12.06 0 01-4.5 0m4.5-2.355a12.06 12.06 0 01-4.5 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'AI Nápady', isNew: true },
  ];

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}