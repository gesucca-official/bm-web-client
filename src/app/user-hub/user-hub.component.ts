import {Component, ViewChild} from '@angular/core';
import {WebsocketService} from "../service/websocket.service";
import {GameService} from "../service/game.service";
import {DebugClientComponent} from "../client-debug/debug-client.component";
import {SessionService} from "../service/session.service";
import {Deck} from "../model/deck";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-hub',
  templateUrl: './user-hub.component.html',
  styleUrls: ['./user-hub.component.css']
})
export class UserHubComponent {

  @ViewChild(DebugClientComponent) debugClient: DebugClientComponent;

  constructor(public websocketService: WebsocketService,
              public gameService: GameService,
              public sessionService: SessionService,
              private router: Router) {
  }

  bounceJoinGameEvent($event: { game: string, deck?: Deck }) {
    if (this.gameService.graphicClient) {
      this.gameService.gameType = $event;
      this.sessionService.isLoadingGame = true;
      this.router.navigateByUrl('/phaser')
    } else {
      this.sessionService.isLoadingGame = true;
      this.debugClient.joinGame($event);
    }
  }
}
