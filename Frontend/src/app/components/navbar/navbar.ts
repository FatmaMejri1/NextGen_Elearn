import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarContent } from '../../models/site-content.models';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  navbar!: NavbarContent;

  constructor(private readonly siteContent: SiteContentService) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.navbar = content.navbar;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  get whatsappHref(): string {
    if (!this.navbar) return '#';
    const separator = this.navbar.whatsappUrl.includes('?') ? '&' : '?';
    return `${this.navbar.whatsappUrl}${separator}text=${this.navbar.whatsappMessage}`;
  }
}
