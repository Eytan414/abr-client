import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, NgZone, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'questions',
  imports: [
    AlertComponent,
    QuestionCardComponent,
    IconDirective,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsComponent implements OnInit, AfterViewInit {

  icons = { cilArrowCircleRight, cilArrowCircleLeft };
  private readonly ngZone = inject(NgZone);
  private readonly backend = inject(BackendService);
  private readonly destroyRef = inject(DestroyRef); 
  readonly appService = inject(AppService);
  carouselInstance!: any;
  activeIndex = signal<number>(0);
  userEntries = signal<number[]>([]);

  showAlert: boolean = false;

  ngOnInit() {
    this.backend.getQuizById().subscribe();
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
          if(e.key === 'ArrowLeft')
            this.carouselInstance.next()
          if(e.key === 'ArrowRight')
            this.carouselInstance.prev();
        });
    });
  }

  alertClosed() {
    this.showAlert = false
  }

  submit() {
    const userEntriesCount = this.userEntries().length;
    const questionsCount = this.appService.questions().length;
    const emptySlots = userEntriesCount - this.userEntries().filter(e => e !== undefined).length;

    if (emptySlots > 1 || questionsCount > (userEntriesCount - 1)) {
      this.showAlert = true;
      return;
    }
    for (let i = 1; i < userEntriesCount; i++) {
      const element = this.userEntries()[i];
      if (!element) {
        this.showAlert = true;
        return;
      }
    }
    const userDetails = { ...this.appService.userDetails(), quizId: this.appService.quizId() };

    const data = { userDetails, userEntries: [...this.userEntries()] };
    this.backend.submitData(data).pipe(
      tap(this.appService.responseSignal.set)
    ).subscribe();
  }


}
