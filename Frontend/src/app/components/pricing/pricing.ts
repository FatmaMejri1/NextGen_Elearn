import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingContent } from '../../models/site-content.models';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class PricingComponent implements OnInit {
  pricing!: PricingContent;
  purchaseWhatsappHref = '#';

  constructor(private readonly siteContent: SiteContentService) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.pricing = content.pricing;
      this.purchaseWhatsappHref = this.siteContent.getWhatsAppUrl('purchase');
    });
  }
}
