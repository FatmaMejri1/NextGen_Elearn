import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoTestimonial } from '../../models/site-content.models';
import { extractYouTubeVideoId } from '../../utils/youtube-url';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss'
})
export class TestimonialsComponent implements AfterViewInit, OnInit {
  @ViewChild('track') track!: ElementRef<HTMLDivElement>;
  activeIndex = 0;
  playingIndex: number | null = null;
  videoTestimonials: VideoTestimonial[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private readonly siteContent: SiteContentService,
  ) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.videoTestimonials = content.videoTestimonials;
    });
  }

  getVideoId(vid: VideoTestimonial): string {
    return vid.videoId || extractYouTubeVideoId(vid.videoUrl ?? '');
  }

  getSafeUrl(vid: VideoTestimonial): SafeResourceUrl {
    const videoId = this.getVideoId(vid);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&playsinline=1&fs=0&iv_load_policy=3`);
  }

  playVideo(index: number) {
    this.playingIndex = index;
  }

  stopVideo(event: Event) {
    event.stopPropagation();
    this.playingIndex = null;
  }

  ngAfterViewInit() {
    if (this.track) {
      this.track.nativeElement.addEventListener('scroll', () => {
        const el = this.track.nativeElement;
        const cardWidth = el.children[0]?.clientWidth || 300;
        const gap = 20;
        this.activeIndex = Math.round(el.scrollLeft / (cardWidth + gap));
      });
    }
  }

  scrollLeft() {
    const el = this.track.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 300;
    el.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
  }

  scrollRight() {
    const el = this.track.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 300;
    el.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
  }

  scrollToCard(index: number) {
    const el = this.track.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 300;
    el.scrollTo({ left: index * (cardWidth + 20), behavior: 'smooth' });
    this.activeIndex = index;
  }
}
