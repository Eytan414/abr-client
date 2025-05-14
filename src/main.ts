import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

const faviconUrl = `${environment.apiUrl}favicon`;
const link = document.createElement('link');
link.rel = 'icon';
link.href = faviconUrl;
document.head.appendChild(link);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
