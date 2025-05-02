import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, NgZone, OnInit, signal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
// @ts-ignore
import {Carousel} from '@coreui/coreui';
import { AlertComponent,} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowCircleRight, cilArrowCircleLeft } from '@coreui/icons';


import {QuestionCardComponent} from '../question-card/question-card.component'
import { BackendService } from '../../services/backend.service';
import { AppService } from '../../services/app.service';
import { tap } from 'rxjs';


@Component({
  selector: 'questions',
  imports: [
    AlertComponent,
    QuestionCardComponent,
    IconDirective,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class QuestionsComponent implements OnInit, AfterViewInit{

  icons = { cilArrowCircleRight, cilArrowCircleLeft };
  private ngZone = inject(NgZone);
  private backend = inject(BackendService);
  appService = inject(AppService);
  private carouselInstance!: any;

  activeIndex = signal<number>(0);
  userEntries = signal<number[]>([]);
  responseSignal = signal<Resp>({});

  showAlert: boolean = false;
  quizSent = computed(() => this.responseSignal().resp === 'success');

  ngOnInit(){
    this.backend.getQuizById().subscribe();
  }
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.carouselInstance = new Carousel(
        document.getElementById('carousel')!,
        { interval: 5000 }
      );

      document.getElementById('carousel')!
        .addEventListener('slide.bs.carousel', (e: any) => {
          this.ngZone.run(() => {
            this.activeIndex = e.to;
          });
        });
    });
  }
  alertClosed(){
    this.showAlert = false
  }
  submit() {
    const userEntriesCount = this.userEntries().length;
    const questionsCount = this.appService.questions().length;
    const emptySlots = userEntriesCount - this.userEntries().filter(() => true).length;
    if(emptySlots > 1) return;
    for (let i = 1; i < userEntriesCount; i++) {
      const element = this.userEntries()[i];
      if(!element){
        this.showAlert = true;
        return;
      }
    }
    if(questionsCount > userEntriesCount){
      this.showAlert = true;
      return;
    }
    let {name, phone, schoolId: school } = this.appService.userDetails();
    const userDetails = { name, phone, school, quizId: this.appService.quizId() };

    const data = { userDetails, userEntries: [...this.userEntries()]};
    this.backend.submitData(data).pipe(
      tap((response:Resp) => {
        this.responseSignal.set(response);
      })
    ).subscribe();
  }

  
}
type Resp = {
  resp?: any;
  savedQuiz?: any;
};


