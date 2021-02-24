import {Component} from '@angular/core';
import {SessionService} from '../../service/session.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  constructor(public sessionService: SessionService) {
  }

  showTitle(): boolean {
    return this.sessionService.isWaitingForUserAccountData || this.sessionService.userAccountData.username == null;
  }

  logOut(): void {
    if (confirm('Are you sure you want to Log Out?')) {
      window.location.reload();
    }
  }
}
