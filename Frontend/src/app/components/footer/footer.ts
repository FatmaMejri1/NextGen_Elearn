import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent implements OnInit {
  /** Override brand name (falls back to site content or default). */
  @Input() brandName?: string;
  /** Override full copyright line (falls back to site content or generated line). */
  @Input() copyright?: string;

  private cmsBrandName = '';
  private cmsCopyright = '';

  constructor(private readonly siteContent: SiteContentService) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.cmsBrandName = content.footer.brandName;
      this.cmsCopyright = content.footer.copyright;
    });
  }

  get copyrightText(): string {
    if (this.copyright?.trim()) return this.copyright.trim();
    if (this.cmsCopyright.trim()) return this.cmsCopyright.trim();

    const brand = this.brandName?.trim() || this.cmsBrandName.trim() || 'Next Generation';
    return `© ${new Date().getFullYear()} ${brand}`;
  }
}
