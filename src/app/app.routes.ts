
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CalendarComponent } from './features/dashboard/calendar/calendar.component';
import { ProductsComponent as AdminProductsComponent } from './features/dashboard/products/products.component';
import { ContentIdeasComponent } from './features/dashboard/content-ideas/content-ideas.component';
import { ServicesComponent } from './features/dashboard/services/services.component';
import { StylistsComponent as AdminStylistsComponent } from './features/dashboard/stylists/stylists.component';
import { GalleryAdminComponent } from './features/dashboard/gallery-admin/gallery-admin.component';
import { OverviewComponent } from './features/dashboard/overview/overview.component';
import { ClientsComponent } from './features/dashboard/clients/clients.component';
import { HomeComponent } from './features/home/home.component';
import { BookingComponent } from './features/booking/booking.component';
import { MyAppointmentsComponent } from './features/my-appointments/my-appointments.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { StylistsComponent } from './features/stylists/stylists.component';
import { ProductsComponent } from './features/products/products.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutComponent } from './features/about/about.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, title: 'PAPI Hair Design | Vitajte' },
  { path: 'booking', component: BookingComponent, title: 'PAPI Hair Design | Rezervácia' },
  { path: 'my-appointments', component: MyAppointmentsComponent, title: 'PAPI Hair Design | Moje Termíny' },
  { path: 'gallery', component: GalleryComponent, title: 'PAPI Hair Design | Galéria' },
  { path: 'stylists', component: StylistsComponent, title: 'PAPI Hair Design | Naši Stylisti' },
  { path: 'products', component: ProductsComponent, title: 'PAPI Hair Design | Naše Produkty' },
  { path: 'contact', component: ContactComponent, title: 'PAPI Hair Design | Kontakt' },
  { path: 'about', component: AboutComponent, title: 'PAPI Hair Design | O Nás' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent, title: 'Dashboard | Prehľad' },
      { path: 'calendar', component: CalendarComponent, title: 'Dashboard | Kalendár' },
      { path: 'clients', component: ClientsComponent, title: 'Dashboard | Klienti' },
      { path: 'products', component: AdminProductsComponent, title: 'Dashboard | Produkty' },
      { path: 'services', component: ServicesComponent, title: 'Dashboard | Služby' },
      { path: 'stylists', component: AdminStylistsComponent, title: 'Dashboard | Stylisti' },
      { path: 'gallery-admin', component: GalleryAdminComponent, title: 'Dashboard | Galéria' },
      { path: 'content-ideas', component: ContentIdeasComponent, title: 'Dashboard | AI Nápady' },
    ]
  },
  { path: '**', redirectTo: '' }
];