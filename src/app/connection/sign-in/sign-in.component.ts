import {Component} from '@angular/core';
import {GameService} from '../../service/game.service';
import {WebsocketService} from '../../service/websocket.service';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import {LogService} from '../../service/log.service';

@Component({
  selector: 'app-server-connection',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  isLoading: boolean;

  playerId: string;
  password: string;

  constructor(public websocketService: WebsocketService,
              public gameService: GameService,
              private http: HttpClient,
              private log: LogService) {
  }

  // tslint:disable-next-line:typedef
  async logIn() {
    this.isLoading = true;
    this.log.info('User \"' + this.playerId + '\" is trying to log in...');
    const areCredentialsValid = await this.checkCredentials(this.playerId, this.password);
    if (!areCredentialsValid) {
      this.log.info('Credentials for User \"' + this.playerId + '\" were not valid: Log In Failed!');
      this.isLoading = false;
      Swal.fire(
        'Log In Failed',
        'Please check your credentials and ensure you are not already logged from somewhere else.',
        'error'
      ).then();
    } else {
      this.log.info('Credential Check Passed: attempting WS connection...');
      this.gameService.playerId = this.playerId;
      this.websocketService.connect(this.playerId, this.password, () => this.loginCallback());
    }
  }

  private loginCallback(): void {
    this.isLoading = false;
  }

  private async checkCredentials(username: string, password: string): Promise<boolean> {
    return this.http.post<boolean>('/rest/sign-in/validate', {
      username,
      password
    }).toPromise();
  }
}
