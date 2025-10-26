import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, Appointment, UserProfile, Stylist, SalonService } from '../models';

// MOCK DATA

const MOCK_USERS: UserProfile[] = [
  { uid: 'user-1', name: 'Jana Nováková', email: 'jana@example.com', loyaltyPoints: 120, preferences: {}, privacyConsent: { marketingEmails: true, appointmentReminders: true, lastUpdated: new Date() }, isAdmin: false },
  { uid: 'user-2', name: 'Peter Čierny', email: 'peter@example.com', loyaltyPoints: 45, preferences: { preferredStylist: 'stylist-2' }, privacyConsent: { marketingEmails: false, appointmentReminders: true, lastUpdated: new Date() }, isAdmin: false },
];

const MOCK_STYLISTS: Stylist[] = [
  { id: 'stylist-1', name: 'Veronika', title: 'Top Stylist', imageUrl: 'https://picsum.photos/seed/stylist1/100/100', description: 'Expert na farbenie a moderné strihy.', services: ['service-1', 'service-3'], skills: ['Balayage', 'Bob cut'] },
  { id: 'stylist-2', name: 'Martin', title: 'Creative Director', imageUrl: 'https://picsum.photos/seed/stylist2/100/100', description: 'Špecialista na pánske strihy a vlasovú starostlivosť.', services: ['service-2', 'service-4'], skills: ['Fade', 'Beard trim'] },
];

const MOCK_SERVICES: SalonService[] = [
  { id: 'service-1', name: 'Dámsky strih', duration: 60, price: 50, category: 'Dámske' },
  { id: 'service-2', name: 'Pánsky strih', duration: 30, price: 30, category: 'Pánske' },
  { id: 'service-3', name: 'Farbenie', duration: 120, price: 120, category: 'Farbenie' },
  { id: 'service-4', name: 'Keratínová kúra', duration: 90, price: 80, category: 'Ostatné' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'appt-1', userId: 'user-1', stylistId: 'stylist-1', serviceId: 'service-1', startTime: new Date(new Date().setHours(10, 0, 0, 0)), endTime: new Date(new Date().setHours(11, 0, 0, 0)), status: 'upcoming' },
  { id: 'appt-2', userId: 'user-2', stylistId: 'stylist-2', serviceId: 'service-2', startTime: new Date(new Date().setHours(14, 0, 0, 0)), endTime: new Date(new Date().setHours(14, 30, 0, 0)), status: 'upcoming' },
];

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Hydratačný šampón', price: 25, imageUrl: 'https://picsum.photos/seed/product1/300/300', description: 'Šampón pre suché a poškodené vlasy.' },
  { id: 2, name: 'Objemový kondicionér', price: 28, imageUrl: 'https://picsum.photos/seed/product2/300/300', description: 'Dodáva vlasom objem a lesk.' },
  { id: 3, name: 'Stylingový gél', price: 18, imageUrl: 'https://picsum.photos/seed/product3/300/300', description: 'Silná fixácia pre moderné účesy.' },
];


@Injectable({
  providedIn: 'root'
})
export class SalonDataService {
  private _products = signal<Product[]>(MOCK_PRODUCTS);
  private _appointments = signal<Appointment[]>(MOCK_APPOINTMENTS);
  private _users = signal<UserProfile[]>(MOCK_USERS);
  
  // Expose signals as readonly for components
  public readonly products = this._products.asReadonly();
  public readonly stylists = signal<Stylist[]>(MOCK_STYLISTS).asReadonly();
  public readonly services = signal<SalonService[]>(MOCK_SERVICES).asReadonly();

  getAllAppointments(): Observable<Appointment[]> {
    return of(this._appointments()).pipe(delay(100)); // simulate async
  }

  getUsers(): Observable<UserProfile[]> {
    return of(this._users()).pipe(delay(100));
  }
  
  createAppointment(appointmentData: Omit<Appointment, 'id'>): Observable<Appointment> {
    const newAppointment: Appointment = {
        ...appointmentData,
        id: `appt-${Date.now()}`
    };
    this._appointments.update(appts => [...appts, newAppointment]);
    return of(newAppointment).pipe(delay(100));
  }

  addProduct(product: Product) {
    const newProduct = { ...product, id: Date.now() };
    this._products.update(products => [...products, newProduct]);
  }

  updateProduct(updatedProduct: Product) {
    this._products.update(products => 
      products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  }

  deleteProduct(productId: number) {
    this._products.update(products => products.filter(p => p.id !== productId));
  }
}
