import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SiteContentService } from '../../services/site-content.service';
import { TextReview } from '../../models/site-content.models';

@Component({
  selector: 'app-social-proof',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-proof.html',
  styleUrl: './social-proof.scss'
})
export class SocialProofComponent implements OnInit {
  reviews: TextReview[] = [];
  statLabel = '250+ subscribers';

  private readonly avatarColors = [
    '#2a5a6e', '#3a6e5a', '#6e3a5a', '#5a6e3a', '#3a5a6e', '#6e5a3a',
    '#5a3a6e', '#3a6e6e', '#6e3a3a', '#4a6e4a', '#6e4a6e', '#4a4a6e',
    '#2a6e5a', '#5a2a6e', '#6e5a2a', '#3a4a6e', '#6e3a4a', '#4a6e3a',
    '#5a4a6e', '#6e4a5a', '#4a5a6e', '#6e6e3a', '#3a6e4a', '#5a6e4a',
    '#6e2a5a', '#4a3a6e',
  ];

  constructor(private readonly siteContent: SiteContentService) {}

  get reviewAvatars(): { letter: string; color: string }[] {
    return this.reviews
      .filter((review) => review.name.trim())
      .map((review) => ({
        letter: review.name.trim().charAt(0),
        color: this.avatarColorFor(review.name),
      }));
  }

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.statLabel = content.socialProof.statLabel;
      this.reviews = content.textReviews;
    });
  }

  private avatarColorFor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.avatarColors[Math.abs(hash) % this.avatarColors.length];
  }

  scrollToReviews() {
    const reviewsEl = document.getElementById('reviews-section');
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
