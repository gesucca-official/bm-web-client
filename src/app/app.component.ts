import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public static SESSION_ID: string = 'sessionId=' + ((new Date()).getMilliseconds() + Math.random() * 100).toString(32);

  constructor() {
  }
}
