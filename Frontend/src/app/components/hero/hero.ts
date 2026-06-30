import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeroContent } from '../../models/site-content.models';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent implements OnInit {
  hero!: HeroContent;

  constructor(
    private readonly siteContent: SiteContentService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.hero = content.hero;
    });
  }

  get hasVideo(): boolean {
    return Boolean(this.hero?.videoUrl?.trim());
  }

  get purchaseWhatsappHref(): string {
    return this.siteContent.getWhatsAppUrl('purchase');
  }

  get embedUrl(): SafeResourceUrl | null {
    if (!this.hero?.videoUrl) return null;
    const url = this.hero.videoUrl.trim();
    const youtubeMatch = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    if (youtubeMatch) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`,
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
