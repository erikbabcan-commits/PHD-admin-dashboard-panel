

import { Component, ChangeDetectionStrategy, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrivacyConsent, UserProfile } from '../../../core/models';

@Component({
  selector: 'app-client-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-modal.component.html',
  styleUrls: ['./client-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  user = input<UserProfile | null>();

  save = output<UserProfile>();
  close = output<void>();

  clientForm!: FormGroup;
  
  isEditMode = false;

  ngOnInit() {
    const u = this.user();
    this.isEditMode = !!u;

    this.clientForm = this.fb.group({
      name: [u?.name || '', Validators.required],
      email: [u?.email || '', [Validators.required, Validators.email]],
      phone: [u?.phone || ''],
    });
  }

  onSave() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const formValue = this.clientForm.value;
    let clientData: UserProfile;

    if (this.isEditMode && this.user()) {
      // Update existing user, merge form values with existing user data
      clientData = {
        ...this.user()!,
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone || undefined, // Ensure phone is optional
      };
    } else {
      // Create new user, providing default values for non-form fields
      const defaultPrivacyConsent: PrivacyConsent = {
        marketingEmails: false,
        appointmentReminders: true,
        lastUpdated: new Date()
      };
      clientData = {
        uid: `user-${Date.now()}`, // Temporary ID, will be overwritten by service if needed
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone || undefined,
        loyaltyPoints: 0,
        preferences: {},
        privacyConsent: defaultPrivacyConsent,
        isAdmin: false
      };
    }
    
    this.save.emit(clientData);
  }

  onClose() {
    this.close.emit();
  }
}