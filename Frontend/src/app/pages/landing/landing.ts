import { Component, HostListener, Renderer2, ElementRef } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { HeroComponent } from '../../components/hero/hero';
import { SocialProofComponent } from '../../components/social-proof/social-proof';
import { CurriculumComponent } from '../../components/curriculum/curriculum';
import { WhatsIncludedComponent } from '../../components/whats-included/whats-included';
import { TestimonialsComponent } from '../../components/testimonials/testimonials';
import { InstagramFeedComponent } from '../../components/instagram-feed/instagram-feed';
import { PricingComponent } from '../../components/pricing/pricing';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent, HeroComponent, SocialProofComponent,
    CurriculumComponent, WhatsIncludedComponent,
    TestimonialsComponent, InstagramFeedComponent, PricingComponent, FooterComponent
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent {
  // Color stops: dark blue → deep navy → indigo → teal-navy → dark blue
  private colorStops = [
    { r: 6,  g: 13, b: 31  },  // #060D1F - very dark blue (top)
    { r: 10, g: 22, b: 50  },  // #0A1632 - dark navy
    { r: 15, g: 25, b: 62  },  // #0F193E - deep indigo
    { r: 8,  g: 30, b: 55  },  // #081E37 - teal navy
    { r: 12, g: 18, b: 45  },  // #0C122D - midnight
    { r: 6,  g: 13, b: 31  },  // #060D1F - back to start
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollTop / docHeight, 1);

    // Map scroll to color stops
    const totalStops = this.colorStops.length - 1;
    const segment = scrollPercent * totalStops;
    const index = Math.floor(segment);
    const t = segment - index;

    const from = this.colorStops[Math.min(index, totalStops)];
    const to = this.colorStops[Math.min(index + 1, totalStops)];

    const r = Math.round(from.r + (to.r - from.r) * t);
    const g = Math.round(from.g + (to.g - from.g) * t);
    const b = Math.round(from.b + (to.b - from.b) * t);

    document.documentElement.style.setProperty('--bg-scroll', `rgb(${r}, ${g}, ${b})`);
  }
}
