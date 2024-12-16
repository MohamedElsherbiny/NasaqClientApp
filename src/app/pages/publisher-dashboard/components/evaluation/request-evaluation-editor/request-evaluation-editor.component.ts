import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookRequest } from '../../../../../shared/models/BookRequest';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faUser, faBook, faCalendar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { EvaluationStatus } from '../../../../../shared/models/EvaluationStatus';

@Component({
  selector: 'app-request-evaluation-editor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './request-evaluation-editor.component.html',
  styleUrl: './request-evaluation-editor.component.scss'
})
export class PublisherBookRequestDetailsComponent implements OnInit {
  @Input() bookRequest: BookRequest | null = {} as BookRequest;
  EvaluationStatus = EvaluationStatus;
  @Output() close = new EventEmitter<boolean>();
  evaluationForm: FormGroup;

  // Font Awesome icons
  faTimes = faTimes;
  faUser = faUser;
  faBook = faBook;
  faCalendar = faCalendar;
  faCheck = faCheck;

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
    if (this.bookRequest?.evaluation) {
      this.evaluationForm.patchValue({
        ...this.bookRequest.evaluation
      });

      console.log(this.evaluationForm.get('languageLevel')?.value);

    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit(status: EvaluationStatus): void {
    if (this.evaluationForm.valid) {
      const formData = {
        ...this.evaluationForm.value,
        evaluationStatus: status,
        requestId: this.bookRequest?.requestId
      };

      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      this.http.post(`Requests/${user['publisherId']}/evaluate-request`, formData).subscribe({
        next: () => {
          let message = '';
          switch (status) {
            case EvaluationStatus.InProgress:
              message = 'تم حفظ النموذج بنجاح';
              break;
            case EvaluationStatus.Completed:
              message = 'تم إرسال التقييم بنجاح';
              break;
          }
          this.toastr.success(message, 'نجاح');
          this.close.emit(true);
        },
        error: (error) => {
          console.error('فشل في إرسال التقييم', error);
          this.toastr.error('فشل في إرسال التقييم، يرجى المحاولة مرة أخرى لاحقًا', 'فشل');
        }
      });
    } else {
      console.warn('فشل إرسال النموذج: النموذج غير صالح');
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'فشل');
    }
  }


}
