import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagColors: { [key: string]: string } = {
    'أولوية عالية': '#ef4444',
    'أولوية متوسطة': '#f59e0b',
    'أولوية منخفضة': '#10b981',
    'مراجعة الكود': '#6366f1',
    'تقني': '#8b5cf6',
    'تصميم': '#ec4899',
    'توثيق': '#14b8a6',
    'تحسين': '#06b6d4',
    'باگ': '#f43f5e'
  };

  getTagColor(tag: string): string {
    // If tag doesn't have a predefined color, generate one
    if (!this.tagColors[tag]) {
      this.tagColors[tag] = this.generateColor(tag);
    }
    return this.tagColors[tag];
  }

  private generateColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  }
}