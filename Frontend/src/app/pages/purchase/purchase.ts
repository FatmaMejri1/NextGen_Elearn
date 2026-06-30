import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../services/site-content.service';
import { WhatsAppContactContent } from '../../models/site-content.models';
import { buildWhatsAppUrl } from '../../utils/whatsapp-url';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase.html',
  styleUrl: './purchase.scss',
})
export class PurchaseComponent implements OnInit {
  whatsappContact!: WhatsAppContactContent;

  constructor(
    private readonly siteContent: SiteContentService,
  ) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.whatsappContact = content.whatsappContact;
    });
  }

  get explanationHref(): string {
    if (!this.whatsappContact) return '#';
    return buildWhatsAppUrl(
      this.whatsappContact.phoneNumber,
      this.whatsappContact.explanation.message,
    );
  }

  get purchaseHref(): string {
    if (!this.whatsappContact) return '#';
    return buildWhatsAppUrl(
      this.whatsappContact.phoneNumber,
      this.whatsappContact.purchase.message,
    );
  }
}
