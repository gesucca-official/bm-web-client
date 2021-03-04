import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {AppComponent} from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private log: NGXLogger) {
  }

  debug(message: any): void {
    this.log.debug(JSON.stringify(message), AppComponent.SESSION_ID);
  }

  info(message: any): void {
    this.log.info(JSON.stringify(message), AppComponent.SESSION_ID);
  }

  error(message: any): void {
    this.log.error(JSON.stringify(message), AppComponent.SESSION_ID);
  }
}
