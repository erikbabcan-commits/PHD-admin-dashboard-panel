


import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientHeaderComponent {}