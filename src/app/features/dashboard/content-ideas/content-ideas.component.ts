

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService, ContentIdea, NotificationService } from '../../../core/services';
import { SpinnerComponent } from '../../../shared/components'; // Updated import path

@Component({
  selector: 'app-content-ideas',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './content-ideas.component.html',
  styleUrls: ['./content-ideas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentIdeasComponent {
  private geminiService = inject(GeminiService);
  private notificationService = inject(NotificationService);

  topic = signal('latest hair color trends');
  ideas = signal<ContentIdea[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  copiedIndex = signal<number | null>(null);

  async generateIdeas() {
    if (!this.topic() || this.isLoading()) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    this.ideas.set([]);

    try {
      const result = await this.geminiService.generateContentIdeas(this.topic());
      this.ideas.set(result);
      this.notificationService.show('Nápady boli úspešne vygenerované!', 'success');
    } catch (e: any) {
      this.error.set(e.message || 'An unknown error occurred.');
      this.notificationService.show('Nepodarilo sa vygenerovať nápady.', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  copyToClipboard(idea: ContentIdea, index: number) {
    const textToCopy = `${idea.title}\n\n${idea.description}\n\n${idea.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.notificationService.show('Obsah skopírovaný do schránky!', 'info');
      this.copiedIndex.set(index);
      setTimeout(() => this.copiedIndex.set(null), 2000);
    });
  }
}