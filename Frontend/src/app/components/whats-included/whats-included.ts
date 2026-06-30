import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsIncludedContent } from '../../models/site-content.models';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-whats-included',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whats-included.html',
  styleUrl: './whats-included.scss',
})
export class WhatsIncludedComponent implements OnInit {
  content!: WhatsIncludedContent;

  constructor(private readonly siteContent: SiteContentService) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((site) => {
      this.content = site.whatsIncluded;
    });
  }
}
