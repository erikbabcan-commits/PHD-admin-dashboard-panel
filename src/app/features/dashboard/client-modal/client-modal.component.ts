import { Component, ChangeDetectionStrategy, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfile } from '../../../core/models';

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
    // We only emit the fields from the form, the service will handle the rest
    const clientData: any = {
      ...this.clientForm.value
    };
    
    this.save.emit(clientData);
  }

  onClose() {
    this.close.emit();
  }
}
