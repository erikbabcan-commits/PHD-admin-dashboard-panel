import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, delay, map } from 'rxjs';
import { Product, Appointment, UserProfile, Stylist, SalonService, GalleryItem } from '../models';

// MOCK DATA

const MOCK_USERS: UserProfile[] = [
  { uid: 'user-1', name: 'Jana Nováková', email: 'jana@example.com', phone: '0901 123 456', loyaltyPoints: 120, preferences: {}, privacyConsent: { marketingEmails: true, appointmentReminders: true, lastUpdated: new Date() }, isAdmin: false },
  { uid: 'user-2', name: 'Peter Čierny', email: 'peter@example.com', phone: '0902 987 654', loyaltyPoints: 45, preferences: { preferredStylist: 'stylist-2' }, privacyConsent: { marketingEmails: false, appointmentReminders: true, lastUpdated: new Date() }, isAdmin: false },
];

const MOCK_STYLISTS: Stylist[] = [
  { id: 'stylist-1', name: 'Veronika', title: 'Top Stylist', imageUrl: 'https://picsum.photos/seed/stylist1/400/400', description: 'Expert na farbenie a moderné strihy.', services: ['service-1', 'service-3', 'service-4'], skills: ['Balayage', 'Bob cut'] },
  { id: 'stylist-2', name: 'Martin', title: 'Creative Director', imageUrl: 'https://picsum.photos/seed/stylist2/400/400', description: 'Špecialista na pánske strihy a vlasovú starostlivosť.', services: ['service-2'], skills: ['Fade', 'Beard trim'] },
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

const MOCK_GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, title: 'Klasický Bob', category: 'Dámske strihy', imageUrl: 'https://picsum.photos/seed/bob/400/500' },
  { id: 2, title: 'Moderný Fade', category: 'Pánske strihy', imageUrl: 'https://picsum.photos/seed/fade/400/500' },
  { id: 3, title: 'Balayage Hnedá', category: 'Farbenie', imageUrl: 'https://picsum.photos/seed/balayage/400/500' },
  { id: 4, title: 'Svadobný účes', category: 'Spoločenské účesy', imageUrl: 'https://picsum.photos/seed/wedding/400/500' },
  { id: 5, title: 'Krátky strih s textúrou', category: 'Dámske strihy', imageUrl: 'https://picsum.photos/seed/texture/400/500' },
  { id: 6, title: 'Úprava brady', category: 'Pánske strihy', imageUrl: 'https://picsum.photos/seed/beard/400/500' },
  { id: 7, title: 'Ombré blond', category: 'Farbenie', imageUrl: 'https://picsum.photos/seed/ombre/400/500' },
  { id: 8, title: 'Plesový drdol', category: 'Spoločenské účesy', imageUrl: 'https://picsum.photos/seed/prom/400/500' },
];


@Injectable({
  providedIn: 'root'
})
export class SalonDataService {
  private _products = signal<Product[]>(MOCK_PRODUCTS);
  private _appointments = signal<Appointment[]>(MOCK_APPOINTMENTS);
  private _users = signal<UserProfile[]>(MOCK_USERS);
  private _stylists = signal<Stylist[]>(MOCK_STYLISTS);
  private _services = signal<SalonService[]>(MOCK_SERVICES);
  private _galleryItems = signal<GalleryItem[]>(MOCK_GALLERY_ITEMS);
  
  // Expose signals as readonly for components
  public readonly products = this._products.asReadonly();
  public readonly stylists = this._stylists.asReadonly();
  public readonly services = this._services.asReadonly();
  public readonly galleryItems = this._galleryItems.asReadonly();
  public readonly users = this._users.asReadonly();
  public readonly appointments = this._appointments.asReadonly();

  // --- Client Booking Methods ---

  getStylistsForService(serviceId: string): Observable<Stylist[]> {
    const stylists = this._stylists().filter(s => s.services.includes(serviceId));
    return of(stylists).pipe(delay(300));
  }
  
  getUserAppointments(userId: string): Observable<Appointment[]> {
    return toObservable(this._appointments).pipe(
      map(appts => appts
        .filter(a => a.userId === userId)
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      )
    );
  }

  getAvailableTimeSlots(stylistId: string, date: Date, serviceDuration: number): Observable<Date[]> {
    const workingHours = { start: 9, end: 18 }; // 9 AM to 6 PM
    const slotInterval = 30; // 30-minute intervals

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingAppointments = this._appointments().filter(a => 
      a.stylistId === stylistId &&
      a.startTime >= startOfDay &&
      a.startTime <= endOfDay &&
      a.status === 'upcoming'
    ).map(a => ({ start: a.startTime.getTime(), end: a.endTime.getTime() }));

    const availableSlots: Date[] = [];
    const now = new Date();

    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minute, 0, 0);

        // Don't show slots in the past
        if (slotStart < now) continue;
        
        const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);

        // Check if slot exceeds working hours
        if (slotEnd.getHours() > workingHours.end || (slotEnd.getHours() === workingHours.end && slotEnd.getMinutes() > 0)) {
          continue;
        }

        const isOverlapping = existingAppointments.some(appt => 
          (slotStart.getTime() < appt.end && slotEnd.getTime() > appt.start)
        );

        if (!isOverlapping) {
          availableSlots.push(slotStart);
        }
      }
    }
    
    return of(availableSlots).pipe(delay(500));
  }

  // --- General & Admin Methods ---
  
  createAppointment(appointmentData: Omit<Appointment, 'id'>): Observable<Appointment> {
    const newAppointment: Appointment = {
        ...appointmentData,
        id: `appt-${Date.now()}`
    };
    this._appointments.update(appts => [...appts, newAppointment]);
    return of(newAppointment).pipe(delay(100));
  }
  
  cancelAppointment(appointmentId: string) {
    this._appointments.update(appts => appts.map(appt => 
      appt.id === appointmentId ? { ...appt, status: 'cancelled' } : appt
    ));
  }

  // User CRUD
  addUser(user: Omit<UserProfile, 'uid' | 'loyaltyPoints' | 'preferences' | 'privacyConsent' | 'isAdmin'>) { 
    const newUser: UserProfile = {
      ...user,
      uid: `user-${Date.now()}`,
      loyaltyPoints: 0,
      preferences: {},
      privacyConsent: { marketingEmails: false, appointmentReminders: true, lastUpdated: new Date() },
      isAdmin: false
    };
    this._users.update(u => [...u, newUser]); 
  }
  updateUser(updatedUser: UserProfile) { this._users.update(u => u.map(user => user.uid === updatedUser.uid ? updatedUser : user)); }
  deleteUser(uid: string) { this._users.update(u => u.filter(user => user.uid !== uid)); }

  // Product CRUD
  addProduct(product: Product) { this._products.update(p => [...p, { ...product, id: Date.now() }]); }
  updateProduct(updatedProduct: Product) { this._products.update(p => p.map(product => product.id === updatedProduct.id ? updatedProduct : product)); }
  deleteProduct(id: number) { this._products.update(p => p.filter(product => product.id !== id)); }

  // Service CRUD
  addService(service: SalonService) { this._services.update(s => [...s, { ...service, id: `service-${Date.now()}` }]); }
  updateService(updatedService: SalonService) { this._services.update(s => s.map(service => service.id === updatedService.id ? updatedService : service)); }
  deleteService(id: string) { this._services.update(s => s.filter(service => service.id !== id)); }
  
  // Stylist CRUD
  addStylist(stylist: Stylist) { this._stylists.update(s => [...s, { ...stylist, id: `stylist-${Date.now()}` }]); }
  updateStylist(updatedStylist: Stylist) { this._stylists.update(s => s.map(stylist => stylist.id === updatedStylist.id ? updatedStylist : stylist)); }
  deleteStylist(id: string) { this._stylists.update(s => s.filter(stylist => stylist.id !== id)); }

  // GalleryItem CRUD
  addGalleryItem(item: GalleryItem) { this._galleryItems.update(g => [...g, { ...item, id: Date.now() }]); }
  updateGalleryItem(updatedItem: GalleryItem) { this._galleryItems.update(g => g.map(item => item.id === updatedItem.id ? updatedItem : item)); }
  deleteGalleryItem(id: number) { this._galleryItems.update(g => g.filter(item => item.id !== id)); }

  getUser(uid: string): UserProfile | undefined {
    return this._users().find(u => u.uid === uid);
  }
}
