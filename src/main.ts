import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

const faviconUrl = `${environment.apiUrl}favicon`;
const link = document.createElement('link');
link.rel = 'icon';
link.href = faviconUrl;
document.head.appendChild(link);

console.log(`%c╔══════════════════════════════════╗
║     Developed by Eytan Ivri      ║
║    Email: eytanivri@gmail.com    ║
╚══════════════════════════════════╝`,
  'color: #ff7777; background: linear-gradient(to right, #004FCB, #1BA2EB); padding: 6px; font-size: 18px; font-weight: bold; border-radius: 4px;',
);
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
