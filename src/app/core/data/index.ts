import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, delay, map } from 'rxjs';
import { Product, Appointment, UserProfile, Stylist, SalonService, GalleryItem, PrivacyConsent } from '../models';

// MOCK DATA

const MOCK_USERS: UserProfile[] = [
  { uid: 'user-1', name: 'Jana Nováková', email: 'jana@example.com', phone: '0901 123 456', loyaltyPoints: 120, preferences: {}, privacyConsent: { marketingEmails: true, appointmentReminders: true, lastUpdated: new Date() }, isAdmin: false },
  { uid: 'user-2', name: 'Peter Čierny', email: 'peter@example.com', phone: '0902 987 654', loyaltyPoints: 45, preferences: { preferredStylist: 'stylist-2' }, privacyConsent: { marketingEmails: false, appointmentReminders: true, lastUpdated: new Date() }, isAdmin: false },
  { uid: 'user-3', name: 'Eva Biela', email: 'eva@example.com', phone: '0915 555 888', loyaltyPoints: 350, preferences: {}, privacyConsent: { marketingEmails: true, appointmentReminders: true, lastUpdated: new Date() }, isAdmin: false },
  { uid: 'user-4', name: 'Marek Hnedý', email: 'marek@example.com', phone: '0903 111 222', loyaltyPoints: 80, preferences: { preferredStylist: 'stylist-1' }, privacyConsent: { marketingEmails: true, appointmentReminders: false, lastUpdated: new Date() }, isAdmin: false },
  { uid: 'user-5', name: 'Zuzana Zelená', email: 'zuzana@example.com', phone: '0904 333 444', loyaltyPoints: 210, preferences: {}, privacyConsent: { marketingEmails: false, appointmentReminders: true, lastUpdated: new Date() }, isAdmin: false },
];

const MOCK_STYLISTS: Stylist[] = [
  { id: 'stylist-1', name: 'Papi', title: 'Majiteľ & Master Stylist', imageUrl: 'https://picsum.photos/seed/papi/400/400', description: 'Zakladateľ salónu s viac ako 15 rokmi skúseností v oblasti vlasového dizajnu. Špecializuje sa na prémiové služby a kreatívne transformácie.', services: ['service-1', 'service-2', 'service-3', 'service-4', 'service-5', 'service-6'], skills: ['Premium strihanie', 'Styling', 'Farba', 'Kreatívne účesy'] },
  { id: 'stylist-2', name: 'Maťo', title: 'Professional Barber', imageUrl: 'https://picsum.photos/seed/mato/400/400', description: 'Špecialista na pánske strihy a úpravu brady s moderným prístupom. Majster klasických aj moderných techník strihania.', services: ['service-2', 'service-6'], skills: ['Pánske strihanie', 'Brada & fúzy', 'Klasické strihy', 'Fade techniques'] },
  { id: 'stylist-3', name: 'Miška', title: 'Creative Hair Artist', imageUrl: 'https://picsum.photos/seed/miska/400/400', description: 'Kreativita a moderné techniky sú jej silnou stránkou. Expertka na farebné transformácie a najnovšie trendy v kaderníctve.', services: ['service-1', 'service-3', 'service-4', 'service-5'], skills: ['Kreatívne farbenie', 'Moderné strihy', 'Highlights', 'Balayage'] },
  { id: 'stylist-4', name: 'Dominik', title: 'Junior Stylist', imageUrl: 'https://picsum.photos/seed/dominik/400/400', description: 'Mladý a ambiciózny stylista s citom pre detail. Špecializuje sa na krátke dámske strihy a pánske úpravy.', services: ['service-1', 'service-2'], skills: ['Krátke strihy', 'Pánske úpravy', 'Trendy'] },
  { id: 'stylist-5', name: 'Lenka', title: 'Colour Expert', imageUrl: 'https://picsum.photos/seed/lenka/400/400', description: 'Majsterka v obore farbenia vlasov. Od klasiky po extravagantné farby, vždy s dôrazom na zdravie vlasov.', services: ['service-3', 'service-4'], skills: ['Blond odtiene', 'Pastelové farby', 'Oprava farieb', 'Olaplex'] },
];

const MOCK_SERVICES: SalonService[] = [
  { id: 'service-1', name: 'Dámsky strih', duration: 60, price: 50, category: 'Dámske' },
  { id: 'service-2', name: 'Pánsky strih', duration: 30, price: 30, category: 'Pánske' },
  { id: 'service-3', name: 'Farbenie Balayage', duration: 180, price: 150, category: 'Farbenie' },
  { id: 'service-4', name: 'Keratínová kúra', duration: 90, price: 80, category: 'Ostatné' },
  { id: 'service-5', name: 'Spoločenský účes', duration: 75, price: 65, category: 'Ostatné' },
  { id: 'service-6', name: 'Úprava brady a holenie', duration: 45, price: 35, category: 'Pánske' },
  { id: 'service-7', name: 'Detský strih', duration: 30, price: 20, category: 'Ostatné' },
  { id: 'service-8', name: 'Melír', duration: 120, price: 100, category: 'Farbenie' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'appt-1', userId: 'user-1', stylistId: 'stylist-1', serviceId: 'service-1', startTime: new Date(new Date().setHours(10, 0, 0, 0)), endTime: new Date(new Date().setHours(11, 0, 0, 0)), status: 'upcoming' },
  { id: 'appt-2', userId: 'user-2', stylistId: 'stylist-2', serviceId: 'service-2', startTime: new Date(new Date().setHours(14, 0, 0, 0)), endTime: new Date(new Date().setHours(14, 30, 0, 0)), status: 'upcoming' },
  { id: 'appt-3', userId: 'user-3', stylistId: 'stylist-3', serviceId: 'service-5', startTime: new Date(new Date().setHours(16, 0, 0, 0)), endTime: new Date(new Date().setHours(17, 15, 0, 0)), status: 'upcoming' },
  { id: 'appt-4', userId: 'user-1', stylistId: 'stylist-1', serviceId: 'service-3', startTime: new Date(new Date().setDate(new Date().getDate() - 5)), endTime: new Date(new Date().setDate(new Date().getDate() - 5) + 180*60*1000), status: 'completed' },
  { id: 'appt-5', userId: 'user-2', stylistId: 'stylist-2', serviceId: 'service-6', startTime: new Date(new Date().setDate(new Date().getDate() - 10)), endTime: new Date(new Date().setDate(new Date().getDate() - 10) + 45*60*1000), status: 'completed' },
  { id: 'appt-6', userId: 'user-4', stylistId: 'stylist-1', serviceId: 'service-2', startTime: new Date(new Date().setHours(11, 30, 0, 0)), endTime: new Date(new Date().setHours(12, 0, 0, 0)), status: 'upcoming' },
];

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'PAPI Signature Pomade', price: 24.99, imageUrl: 'https://picsum.photos/seed/pomade/400/400', description: 'Silná fixácia s jemným leskom. Ideálna pre klasické účesy.' },
  { id: 2, name: 'Ocean Salt Spray', price: 19.50, imageUrl: 'https://picsum.photos/seed/spray/400/400', description: 'Dodá vlasom textúru a objem pre dokonalý "plážový" vzhľad.' },
  { id: 3, name: 'Nourishing Beard Oil', price: 29.90, imageUrl: 'https://picsum.photos/seed/oil/400/400', description: 'Vyživujúci olej pre hebkú a zdravú bradu s vôňou santalového dreva.' },
  { id: 4, name: 'Matte Clay Wax', price: 22.00, imageUrl: 'https://picsum.photos/seed/wax/400/400', description: 'Matný finiš so strednou fixáciou pre prirodzený a moderný styling.' },
  { id: 5, name: 'Hydrating Hair Mask', price: 35.00, imageUrl: 'https://picsum.photos/seed/mask/400/400', description: 'Hĺbkovo hydratačná maska pre suché a poškodené vlasy. Obnovuje vitalitu.' },
  { id: 6, name: 'Thermal Protection Spray', price: 21.50, imageUrl: 'https://picsum.photos/seed/thermal/400/400', description: 'Chráni vlasy pred poškodením teplom pri fénovaní, žehlení alebo kulmovaní.' },
  { id: 7, name: 'Volume Boost Shampoo', price: 18.00, imageUrl: 'https://picsum.photos/seed/shampoo/400/400', description: 'Šampón pre objem, ktorý dodá vlasom plnosť a vzdušnosť bez zaťaženia.' },
  { id: 8, name: 'Hair Elixir Serum', price: 42.00, imageUrl: 'https://picsum.photos/seed/serum/400/400', description: 'Luxusné vlasové sérum pre lesk, hebkosť a ochranu pred krepovatením.' },
  { id: 9, name: 'Texturizing Powder', price: 16.50, imageUrl: 'https://picsum.photos/seed/powder/400/400', description: 'Ľahký prášok pre okamžitú textúru a objem s matným finišom.' },
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
  { id: 9, title: 'Pánsky klasický strih', category: 'Pánske strihy', imageUrl: 'https://picsum.photos/seed/classicmen/400/500' },
  { id: 10, title: 'Medený melír', category: 'Farbenie', imageUrl: 'https://picsum.photos/seed/highlights/400/500' },
  { id: 11, title: 'Pixie Cut', category: 'Dámske strihy', imageUrl: 'https://picsum.photos/seed/pixie/400/500' },
  { id: 12, title: 'Vlny na slávnosť', category: 'Spoločenské účesy', imageUrl: 'https://picsum.photos/seed/waves/400/500' },
  { id: 13, title: 'Pánsky undercut', category: 'Pánske strihy', imageUrl: 'https://picsum.photos/seed/undercut/400/500' },
  { id: 14, title: 'Extravagantné farbenie', category: 'Farbenie', imageUrl: 'https://picsum.photos/seed/extravagant/400/500' },
  { id: 15, title: 'Dlhé vrstvené vlasy', category: 'Dámske strihy', imageUrl: 'https://picsum.photos/seed/longlayers/400/500' },
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
      delay(300), // Simulate API call
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
  
  cancelAppointment(appointmentId: string): Observable<void> {
    this._appointments.update(appts => appts.map(appt => 
      appt.id === appointmentId ? { ...appt, status: 'cancelled' } : appt
    ));
    return of(undefined).pipe(delay(300));
  }

  // User CRUD
  addUser(user: UserProfile): Observable<void> { // Changed to accept full UserProfile
    this._users.update(u => [...u, user]); 
    return of(undefined).pipe(delay(300));
  }
  updateUser(updatedUser: UserProfile): Observable<void> { 
    this._users.update(u => u.map(user => user.uid === updatedUser.uid ? updatedUser : user)); 
    return of(undefined).pipe(delay(300));
  }
  deleteUser(uid: string): Observable<void> { 
    this._users.update(u => u.filter(user => user.uid !== uid)); 
    return of(undefined).pipe(delay(300));
  }

  // Product CRUD
  addProduct(product: Product): Observable<void> { 
    this._products.update(p => [...p, { ...product, id: Date.now() }]); 
    return of(undefined).pipe(delay(300));
  }
  updateProduct(updatedProduct: Product): Observable<void> { 
    this._products.update(p => p.map(product => product.id === updatedProduct.id ? updatedProduct : product)); 
    return of(undefined).pipe(delay(300));
  }
  deleteProduct(id: number): Observable<void> { 
    this._products.update(p => p.filter(product => product.id !== id)); 
    return of(undefined).pipe(delay(300));
  }

  // Service CRUD
  addService(service: SalonService): Observable<void> { 
    this._services.update(s => [...s, { ...service, id: `service-${Date.now()}` }]); 
    return of(undefined).pipe(delay(300));
  }
  updateService(updatedService: SalonService): Observable<void> { 
    this._services.update(s => s.map(service => service.id === updatedService.id ? updatedService : service)); 
    return of(undefined).pipe(delay(300));
  }
  deleteService(id: string): Observable<void> { 
    this._services.update(s => s.filter(service => service.id !== id)); 
    return of(undefined).pipe(delay(300));
  }
  
  // Stylist CRUD
  addStylist(stylist: Stylist): Observable<void> { 
    this._stylists.update(s => [...s, { ...stylist, id: `stylist-${Date.now()}` }]); 
    return of(undefined).pipe(delay(300));
  }
  updateStylist(updatedStylist: Stylist): Observable<void> { 
    this._stylists.update(s => s.map(stylist => stylist.id === updatedStylist.id ? updatedStylist : stylist)); 
    return of(undefined).pipe(delay(300));
  }
  deleteStylist(id: string): Observable<void> { 
    this._stylists.update(s => s.filter(stylist => stylist.id !== id)); 
    return of(undefined).pipe(delay(300));
  }

  // GalleryItem CRUD
  addGalleryItem(item: GalleryItem): Observable<void> { 
    this._galleryItems.update(g => [...g, { ...item, id: Date.now() }]); 
    return of(undefined).pipe(delay(300));
  }
  updateGalleryItem(updatedItem: GalleryItem): Observable<void> { 
    this._galleryItems.update(g => g.map(item => item.id === updatedItem.id ? updatedItem : item)); 
    return of(undefined).pipe(delay(300));
  }
  deleteGalleryItem(id: number): Observable<void> { 
    this._galleryItems.update(g => g.filter(item => item.id !== id)); 
    return of(undefined).pipe(delay(300));
  }

  getUser(uid: string): UserProfile | undefined {
    return this._users().find(u => u.uid === uid);
  }
}