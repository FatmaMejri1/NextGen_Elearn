import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent as App } from './app/app';
import { clearLegacyLocalStorage } from './app/utils/legacy-storage-cleanup';

clearLegacyLocalStorage();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
