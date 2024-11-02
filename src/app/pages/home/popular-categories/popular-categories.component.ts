import { Component } from '@angular/core';

interface JobCategory {
  icon: string;
  title: string;
  availability: string;
}

@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.scss'
})
export class PopularCategoriesComponent {

  jobCategories: JobCategory[] = [
    {
      icon: 'flaticon-resume',
      title: 'التقييم الأدبي',
      availability: 'متاح حالياً'
    },
    {
      icon: 'flaticon-user',
      title: 'الترجمة',
      availability: 'قريباً'
    },
    {
      icon: 'flaticon-magnifying-glass',
      title: 'التدقيق اللغوي',
      availability: 'قريباً'
    },
    {
      icon: 'flaticon-edit',
      title: 'التحرير والصياغة',
      availability: 'قريباً'
    },
    {
      icon: 'flaticon-cv-1',
      title: 'صناعة المحتوى',
      availability: 'قريباً'
    },
    {
      icon: 'flaticon-note',
      title: 'خدمات النشر',
      availability: 'قريباً'
    }
  ];
}
