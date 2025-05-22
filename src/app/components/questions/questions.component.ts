import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, NgZone, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// @ts-ignore
import { Carousel } from '@coreui/coreui';
import { AlertComponent, } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowCircleRight, cilArrowCircleLeft } from '@coreui/icons';

import { QuestionCardComponent } from './question-card/question-card.component'
import { BackendService } from '../../services/backend.service';
import { AppService } from '../../services/app.service';
import { filter, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GaTrackingService } from '../../services/ga-tracking.service';

@Component({
  selector: 'questions',
  imports: [
    AlertComponent,
    QuestionCardComponent,
    IconDirective,
    MatProgressSpinnerModule,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsComponent implements OnInit, AfterViewInit {
  icons = { cilArrowCircleRight, cilArrowCircleLeft };
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly backend = inject(BackendService);
  private readonly tracking = inject(GaTrackingService);
  readonly appService = inject(AppService);
  carouselInstance!: any;
  activeIndex = signal<number>(0);
  userEntries = signal<(number | string)[]>([]);
  loading = signal<boolean>(false);
  showAlert = signal<boolean>(false);

  ngOnInit() {
    this.backend.getQuizById(this.appService.quizId()!)
      .pipe(tap(quiz => {
        this.appService.questions.set(quiz.questions);
      })).subscribe();

    const { name } = this.appService.userDetails()
    const text = `${name}: started quiz at: ${new Date().toLocaleDateString('en-GB')}`;

    this.tracking.sendEvent(text)

  }

  ngAfterViewInit(): void {
    const el = document.getElementById('carousel')!;
    this.ngZone.runOutsideAngular(() => {
      this.carouselInstance = new Carousel(el, { interval: 5000 });

      fromEvent<KeyboardEvent>(window, 'keydown')
        .pipe(
          filter(e => ['ArrowLeft', 'ArrowRight'].includes(e.key)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(e => {
          if (e.key === 'ArrowLeft')
            this.carouselInstance.next()
          if (e.key === 'ArrowRight')
            this.carouselInstance.prev();
        });
    });
  }

  alertClosed() {
    this.showAlert.set(false)
  }

  submit() {
    const userEntriesCount = this.userEntries().length;
    const questionsCount = this.appService.questions().length;
    const emptySlots = userEntriesCount - this.userEntries().filter(e => e !== undefined).length;

    if (emptySlots > 1 || questionsCount > (userEntriesCount - 1)) {
      this.showAlert.set(true);
      return;
    }
    for (let i = 1; i < userEntriesCount; i++) {
      const element = this.userEntries()[i];
      if (!element) {
        this.showAlert.set(true);
        return;
      }
    }
    this.loading.set(true);
    const userDetails = { ...this.appService.userDetails(), quizId: this.appService.quizId() };

    const data = { userDetails, userEntries: [...this.userEntries()] };
    this.backend.submitData(data).pipe(
      tap(() => {
        const name = this.appService.userDetails().name
        const text = `${name}: sent quiz at: ${new Date().toLocaleDateString('en-GB')}`;
        this.tracking.sendEvent(text);

        this.loading.set(false);
      }
      ),
      tap(this.appService.responseSignal.set)
    ).subscribe();
  }


  calcCarouselCardClass(index:number) {
    return { 
      'active': index === this.activeIndex(),
      'answered': this.userEntries().at(index + 1)
    }
  }
}
