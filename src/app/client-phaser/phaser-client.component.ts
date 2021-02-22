import {AfterViewInit, Component} from '@angular/core';
import Phaser from 'phaser';
import {PhaserSettingsService} from "./phaser-settings.service";
import {WebsocketService} from "../service/websocket.service";
import {GameService} from "../service/game.service";
import {BattleScene} from "./scnenes/battle/battle-scene";
import {Deck} from "../model/deck";
import {Router} from "@angular/router";
import {SessionService} from "../service/session.service";

@Component({
  selector: 'app-phaser-client',
  templateUrl: './phaser-client.component.html',
  styleUrls: ['./phaser-client.component.css']
})
export class PhaserClientComponent implements AfterViewInit {

  config: Phaser.Types.Core.GameConfig;

  constructor(
    private router: Router,
    public sessionService: SessionService,
    protected websocketService: WebsocketService,
    protected gameService: GameService,
    protected settingsService: PhaserSettingsService) {
  }

  ngAfterViewInit(): void {
    this.joinGame(this.gameService.gameType);
  }

  joinGame(whichGame: { game: string, deck?: Deck }) {
    window['gameService'] = this.gameService;
    window['settingsService'] = this.settingsService;

    this.websocketService.joinGame(this.gameService.playerId, whichGame.game, (sdkEvent => {
      this.gameService.gameId = sdkEvent.body;
      this.websocketService.subToGame(
        this.gameService.gameId,
        this.gameService.playerId,
        (sdkEvent) => console.log(sdkEvent.body),
        (sdkEvent) => console.log(sdkEvent.body),
        (sdkEvent) => this.viewUpdateCallback(sdkEvent)
      );
      this.websocketService.requestGameView(this.gameService.gameId, this.gameService.playerId);
    }), whichGame.deck);
  }

  private viewUpdateCallback(sdkEvent: any) {
    this.gameService.gameState = JSON.parse(sdkEvent.body);

    if (this.gameService.gameState.over) {
      this.router.navigateByUrl('/hub')
      this.gameService.clearGame();
      this.settingsService.currentScene.game.destroy(true, true);
    }

    if (this.settingsService.currentScene === undefined)
      this.initGameConfig();
    else {
      this.settingsService.currentScene.scene.restart();
    }
  }

  private initGameConfig() {
    this.sessionService.isLoadingGame = false;
    this.config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NONE,
        width: this.settingsService.getScreenWidth(),
        height: this.settingsService.getScreenHeight()
      },
      scene: [BattleScene]
    }
  }

}
