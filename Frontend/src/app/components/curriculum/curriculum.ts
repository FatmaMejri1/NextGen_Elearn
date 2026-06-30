import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CurriculumContent } from '../../models/site-content.models';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './curriculum.html',
  styleUrl: './curriculum.scss',
})
export class CurriculumComponent implements AfterViewInit, OnInit {
  @ViewChild('track') track!: ElementRef<HTMLDivElement>;
  @ViewChild('langTrack') langTrack!: ElementRef<HTMLDivElement>;
  activeIndex = 0;
  activeIndexLang = 0;
  curriculum!: CurriculumContent;

  constructor(private readonly siteContent: SiteContentService) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.curriculum = content.curriculum;
    });
  }

  ngAfterViewInit() {
    if (this.track) {
      this.track.nativeElement.addEventListener('scroll', () => {
        const el = this.track.nativeElement;
        const cardWidth = el.children[0]?.clientWidth || 320;
        const gap = 24;
        this.activeIndex = Math.round(el.scrollLeft / (cardWidth + gap));
      });
    }

    if (this.langTrack) {
      this.langTrack.nativeElement.addEventListener('scroll', () => {
        const el = this.langTrack.nativeElement;
        const cardWidth = el.children[0]?.clientWidth || 240;
        const gap = 16;
        this.activeIndexLang = Math.round(el.scrollLeft / (cardWidth + gap));
      });
    }
  }

  scrollLeft() {
    const el = this.track.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 320;
    el.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
  }

  scrollRight() {
    const el = this.track.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 320;
    el.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
  }

  scrollToCard(index: number) {
    const el = this.track.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 320;
    el.scrollTo({ left: index * (cardWidth + 24), behavior: 'smooth' });
    this.activeIndex = index;
  }

  scrollLeftLang() {
    const el = this.langTrack.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 240;
    el.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
  }

  scrollRightLang() {
    const el = this.langTrack.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 240;
    el.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
  }

  scrollToLang(index: number) {
    const el = this.langTrack.nativeElement;
    const cardWidth = el.children[0]?.clientWidth || 240;
    el.scrollTo({ left: index * (cardWidth + 16), behavior: 'smooth' });
    this.activeIndexLang = index;
  }
}
