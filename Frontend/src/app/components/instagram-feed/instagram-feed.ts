import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstagramContent } from '../../models/site-content.models';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-instagram-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instagram-feed.html',
  styleUrl: './instagram-feed.scss',
})
export class InstagramFeedComponent implements OnInit {
  instagram!: InstagramContent;

  constructor(private readonly siteContent: SiteContentService) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.instagram = content.instagram;
    });
  }
}
