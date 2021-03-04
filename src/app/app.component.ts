import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public static SESSION_ID: string = 'sessionId=' + ((new Date()).getMilliseconds() + Math.random() * 100).toString(32);

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    // save errors to server
    const error = console.error.bind(console);
    console.error = (...args) => {
      error(...args);
      http.post<void>('/rest/logs/client/web/', {
        timestamp: this.datePipe.transform(new Date(), 'YYYY-MM-dd_HH:mm:ss.SSS'),
        message: args.join(' '),
        additional: [AppComponent.SESSION_ID]
      }).subscribe(/*no return*/);
    };
  }
}
