import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // Or './app/app.component' depending on your exact filename
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig) // 👈 Make sure appConfig is passed right here!
  .catch((err) => console.error(err));