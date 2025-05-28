import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'log-message',
  imports: [NgxJsonViewerModule],
  templateUrl: './log-message.component.html',
  styleUrl: './log-message.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogMessageComponent {

  message = input.required<string>()

}
