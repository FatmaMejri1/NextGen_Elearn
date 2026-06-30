import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-for-who',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './for-who.html',
  styleUrl: './for-who.scss',
})
export class ForWhoComponent {
  readonly title = 'الباقة هذي ليك إذا كنت';
  readonly subtitle = 'الباقة الكاملة هذي ليك إذا كنت...';
  readonly imageUrl = 'Pic.png';
  readonly ctaText = 'احصل على الباقة الكاملة توا';
  readonly ctaLink = '#pricing';

  readonly forWhoItems = [
    {
      icon: '🚀',
      title: 'مبتدئ أو طالب تحب تبني كارير ناجحة',
      subtitle: 'Students & Beginners wanting to master high-income skills (AI, Web Dev, Languages) from scratch.',
    },
    {
      icon: '💼',
      title: 'صاحب مشروع ولا فريلانسر تلوّج على التطور',
      subtitle: 'Entrepreneurs & Freelancers looking to scale with E-commerce, Trading, and Digital Marketing strategies.',
    },
    {
      icon: '🌍',
      title: 'طموح وتحب تخدم مع شركات عالمية',
      subtitle: 'Ambitious minds wanting to learn 10 international languages and unlock global remote opportunities.',
    },
    {
      icon: '🎨',
      title: 'صنّاع المحتوى والمصممين',
      subtitle: 'Content Creators & Designers wanting to master UI/UX, Graphic Design, and Video Editing.',
    },
    {
      icon: '🛡️',
      title: 'المهتمين بالأمن السيبراني والبرمجة',
      subtitle: 'Tech enthusiasts looking to dive deep into Cyber Security, Full Stack Development, and Data Science.',
    },
  ];
}
