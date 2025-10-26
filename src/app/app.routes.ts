import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CalendarComponent } from './features/dashboard/calendar/calendar.component';
import { ProductsComponent } from './features/dashboard/products/products.component';
import { ContentIdeasComponent } from './features/dashboard/content-ideas/content-ideas.component';

export const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: 'calendar', component: CalendarComponent, title: 'Dashboard | Kalendár' },
      { path: 'products', component: ProductsComponent, title: 'Dashboard | Produkty' },
      { path: 'content-ideas', component: ContentIdeasComponent, title: 'Dashboard | AI Nápady' },
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
