import {
  AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef,
  inject, NgZone, OnInit, signal, ViewChild
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// @ts-ignore
import { Carousel } from '@coreui/coreui';
import { AlertComponent, } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowCircleRight, cilArrowCircleLeft } from '@coreui/icons';

import { QuestionCardComponent } from './question-card/question-card.component'
import { BackendService } from '../../services/backend.service';
import { AppService, Resp } from '../../services/app.service';
import { catchError, debounceTime, filter, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs/internal/observable/empty';

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
  protected icons = { cilArrowCircleRight, cilArrowCircleLeft };
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly backend = inject(BackendService);
  protected readonly appService = inject(AppService);
  private carouselInstance!: any;
  protected readonly activeIndex = signal<number>(0);
  protected readonly userEntries = signal<(number | string)[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly showAlert = signal<boolean>(false);
  @ViewChild('submitBtn', { static: true }) submitBtn!: ElementRef<HTMLButtonElement>;

  ngOnInit() {
    this.backend.getQuizById(this.appService.quizId()!)
      .pipe(tap(quiz => {
        this.appService.questions.set(quiz.questions);
      })).subscribe();

    const { name } = this.appService.userDetails();
    const message = JSON.stringify({ name });
    this.backend.saveLog('info', message, 'started quiz').subscribe();
  }

  ngAfterViewInit(): void {
    this.setupCarousel();
    this.setupSubmitBtn();
  }

  private setupSubmitBtn() {
    fromEvent(this.submitBtn.nativeElement, 'click')
      .pipe(
        debounceTime(400),
        tap(() => this.submit()),
      ).subscribe();
  }

  private setupCarousel() {
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

  protected submit() {
    if (this.appService.quizSent()) return;
    const userEntriesCount = this.userEntries().length;
    const quizQuestionsCount = this.appService.questions().length;
    const emptySlots = userEntriesCount - this.userEntries().filter(e => e !== undefined).length;

    if (emptySlots > 1 || quizQuestionsCount > (userEntriesCount - 1)) {
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
    const message = JSON.stringify(data);
    this.backend.saveLog('info', message, 'sent quiz').subscribe();

    this.backend.submitData(data).pipe(
      tap(_ => this.loading.set(false)),
      tap(this.appService.responseSignal.set),
      tap(resp => this.onSubmitLog(resp)),
      catchError(err => {
        this.backend.saveLog('error', JSON.stringify(err), 'quiz response').subscribe();
        const errorMessage = err.status
          ? `Error: ${err.status}: ${err.statusText}`
          : err.message;
        this.appService.responseSignal.set({ resp: errorMessage });
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe();
  }
  
  protected onSubmitLog(response: Resp) {
    response.resp === 'success'
      ? this.backend.saveLog('success', JSON.stringify(response), 'quiz response').subscribe()
      : this.backend.saveLog('warn', JSON.stringify(response), 'quiz response').subscribe()
  }

  protected calcCarouselCardClass(index: number) {
    return {
      'active': index === this.activeIndex(),
      'answered': this.userEntries().at(index + 1)
    }
  }
}
