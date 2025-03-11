import { Component, Input, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { EvaluationStatus } from '../../../../../shared/models/EvaluationStatus';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="evaluation-page">
      <div class="evaluation-header">
        <h2>معلومات الطلب</h2>
      </div>
      
<form [formGroup]="evaluationForm">
<div class="evaluation-form">
                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3>المستوى اللغوي</h3>
                                <p class="hint">التطابق مع ما يتجاوز 100 كلمة</p>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('languageLevel')!.setValue(n)"
                                            [checked]="evaluationForm.get('languageLevel')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group mt-3">
                                <input type="text" formControlName="languageLevelComment" class="form-control"
                                    placeholder="التعليق بما لا يتجاوز ال100 كلمة">
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3>الفكرة العامة</h3>
                                <div class="form-group">
                                    <select class="form-control">
                                        <option *ngFor="let idea of generalIdeas" [value]="idea.value"> {{idea.label}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('theGeneralIdea')!.setValue(n)"
                                            [checked]="evaluationForm.get('theGeneralIdea')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group mt-3">
                                <input type="text" class="form-control" formControlName="theGeneralIdeaComment"
                                    placeholder="التعليق بما لا يتجاوز ال100 كلمة">
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3>الأصالة والإبداع</h3>
                                <p class="hint">تفرد العمل وابتكاره وخروجه عن الأعراف الراسخة</p>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('originalityAndCreativity')!.setValue(n)"
                                            [checked]="evaluationForm.get('originalityAndCreativity')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3>الجاذبية الإبداعية</h3>
                                <p class="hint">جاذبية العمل البصرية أو السمعية أو الفكرية وقدرته على إثارة العواطف أو
                                    الأفكار</p>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('creativeAttraction')!.setValue(n)"
                                            [checked]="evaluationForm.get('creativeAttraction')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3>التقنية والحرفية</h3>
                                <p class="hint">التقييد الماهر والإتقان في الشكل والأسلوب والوسيلة</p>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('technologyAndCraftsmanship')!.setValue(n)"
                                            [checked]="evaluationForm.get('technologyAndCraftsmanship')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3> المحتوى الموضوعي </h3>
                                <p class="hint">أهمية وعمق وأهمية موضوعات العمل أو رسائله أو أفكاره. </p>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('objectiveContent')!.setValue(n)"
                                            [checked]="evaluationForm.get('objectiveContent')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3> التأثير </h3>
                                <p class="hint">التأثير الدائم للعمل على الفن أو الأدب اللاحق ودوره كمحفز للتغيير. </p>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('impact')!.setValue(n)"
                                            [checked]="evaluationForm.get('impact')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3> إمكانية الوصول </h3>
                                <p class="hint">قدرة العمل على التواصل بشكل فعال مع جمهور واسع. </p>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('accessibility')!.setValue(n)"
                                            [checked]="evaluationForm.get('accessibility')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3> هل هذا الكتاب سيهم القراء؟ </h3>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('willInterestReaders')!.setValue(n)"
                                            [checked]="evaluationForm.get('willInterestReaders')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group mt-3">
                                <input type="text" class="form-control" formControlName="willInterestReadersComment"
                                    placeholder="التعليق بما لا يتجاوز ال100 كلمة">
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3> هل هذا الكتاب مبيعات ام جوائز ام اخرى </h3>
                                <div class="form-group">
                                    <select name="idea" class="form-control">
                                        <option *ngFor="let category of bookCategory" [value]="category.value">
                                            {{category.label}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('isSalesOrAwardsOrOther')!.setValue(n)"
                                            [checked]="evaluationForm.get('isSalesOrAwardsOrOther')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group mt-3">
                                <input type="text" class="form-control" formControlName="isSalesOrAwardsOrOtherComment"
                                    placeholder="التعليق بما لا يتجاوز ال100 كلمة">
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3> هل هذا الكتاب مسروق ام أصلى ام مقتبس </h3>
                                <div class="form-group">
                                    <select name="idea" class="form-control"
                                        formControlName="isStolenOrOriginalOrCopied">
                                        <option *ngFor="let category of stolenOrOriginal" [value]="category.value">
                                            {{category.label}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('isStolenOrOriginalOrCopiedComment')!.setValue(n)"
                                            [checked]="evaluationForm.get('isStolenOrOriginalOrCopiedComment')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="evaluation-section">
                            <div class="section-header">
                                <h3> درجة التقييم </h3>
                                <p class="hint">من وجهه نظر المقيم الشخصية </p>
                            </div>
                            <div class="rating-group">
                                <div class="rating-numbers">
                                    <label *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]">
                                        <input type="radio" [value]="n"
                                            (change)="evaluationForm.get('evaluationScore')!.setValue(n)"
                                            [checked]="evaluationForm.get('evaluationScore')?.value == n">
                                        <span>{{ n }}</span>
                                    </label>
                                </div>
                            </div>

                            <div class="form-group mt-3">
                                <input type="text" class="form-control" formControlName="evaluationScoreComment"
                                    placeholder="التعليق بما لا يتجاوز ال100 كلمة">
                            </div>
                        </div>

                    </div>
</form>
    </div>

  `,
  styles: [`
    .evaluation-page {
      padding: 2rem;
      background: var(--bg-color);
      color: var(--text-color);
      overflow: scroll;
      max-height: 29rem;
    }

    .evaluation-header {
      margin-bottom: 2rem;
    }

    .evaluation-header h2 {
      font-size: 1.5rem;
      color: var(--text-color);
    }

    .evaluation-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
    }

    .section-header {
      margin-bottom: 1rem;
    }

    .section-header h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .hint {
      font-size: 0.9rem;
      color: var(--text-color);
      opacity: 0.8;
    }

    .hint-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .hint-icon {
      width: 20px;
      height: 20px;
      background: #4573d2;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .rating-group {
      margin-top: 1rem;
    }

    .rating-numbers {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .rating-numbers label {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    .rating-numbers input {
      margin: 0;
      opacity: 0;
      position: absolute;
    }

    .rating-numbers span {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--border-color);
      border-radius: 50%;
      color: var(--text-color);
      transition: all 0.2s ease;
    }

    .rating-numbers input:checked + span {
      background: #4573d2;
      border-color: #4573d2;
      color: white;
    }

    .rating-numbers label:hover span {
      background: var(--hover-bg);
      border-color: #4573d2;
    }

    .form-actions {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
    }

    .submit-btn {
      background: #4573d2;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s ease;
    }

    .submit-btn:hover {
      background: #3b63b8;
    }
  `]
})
export class ProjectEvaluationComponent implements OnInit {
  @Input() projectId: number | null = null;
  evaluationForm: FormGroup;
  EvaluationStatus = EvaluationStatus;
  generalIdeas = [
    {
      label: 'متكرر',
      value: '1'
    },
    {
      label: ' جديد',
      value: ' 2'
    },
    {
      label: 'مبتكر',
      value: '3'
    },
    {
      label: 'جذاب',
      value: '4'
    },
    {
      label: 'أخرى',
      value: '5'
    }
  ];

  bookCategory = [
    {
      label: 'مبيعات',
      value: '1'
    },
    {
      label: ' جوائز',
      value: ' 2'
    },
    {
      label: 'أخرى',
      value: '3'
    }
  ];

  stolenOrOriginal = [
    {
      label: 'مسروق',
      value: '1'
    },
    {
      label: ' أصلي',
      value: ' 2'
    },
    {
      label: 'مقتبس',
      value: '3'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService) {
    this.evaluationForm = this.fb.group({
      languageLevel: [''],
      languageLevelComment: [''],
      theGeneralIdea: [''],
      theGeneralIdeaComment: [''],
      originalityAndCreativity: [''],
      originalityAndCreativityComment: [''],
      creativeAttraction: [''],
      creativeAttractionComment: [''],
      technologyAndCraftsmanship: [''],
      technologyAndCraftsmanshipComment: [''],
      objectiveContent: [''],
      objectiveContentComment: [''],
      impact: [''],
      impactComment: [''],
      accessibility: [''],
      accessibilityComment: [''],
      willInterestReaders: [''],
      willInterestReadersComment: [''],
      isSalesOrAwardsOrOther: [''],
      isSalesOrAwardsOrOtherComment: [''],
      isStolenOrOriginalOrCopied: [''],
      isStolenOrOriginalOrCopiedComment: [''],
      containProhibitedContents: [''],
      canWinAwards: [''],
      canWinAwardsComment: [''],
      howToIncreaseSales: [''],
      howToIncreaseSalesComment: [''],
      evaluationScore: [''],
      evaluationScoreComment: [''],
      bookFileNameIncludingEvaluationNotes: ['']
    });
  }

  ngOnInit(): void {
    this.getProjectEvaluation();
  }

  submitEvaluation() {
  }

  getProjectEvaluation(): void {
    this.http.get(`Projects/evaluation`, { projectId: this.projectId }).subscribe({
      next: (response: any) => {
        this.evaluationForm.patchValue({
          ...response.evaluation
        });
      },

      error: (error) => {
        console.error('Failed to fetch requests', error);
      },
    });
  }

}