export interface HomeSectionLink {
  label: string;
  href: string;
}

export const HOME_SECTION_LINKS: HomeSectionLink[] = [
  { label: 'عنّا', href: '#about' },
  { label: 'الكليونات', href: '#social-proof' },
  { label: 'الفورماسيونات', href: '#programme' },
  { label: 'اللغات', href: '#languages' },
  { label: 'شنوّا مشمول', href: '#included' },
  { label: 'شنوّا يقولو علينا', href: '#testimonials' },
  { label: 'إنستغرام', href: '#instagram' },
  { label: 'الأسعار', href: '#pricing' },
];

export function mapHomeSectionLinks(createId: () => string): { id: string; label: string; href: string }[] {
  return HOME_SECTION_LINKS.map((link) => ({ id: createId(), ...link }));
}
