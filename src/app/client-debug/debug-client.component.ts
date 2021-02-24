import {Component} from '@angular/core';
import {WebsocketService} from '../service/websocket.service';
import {MatDialog} from '@angular/material/dialog';
import {CodeDialogComponent} from './code-dialog/code-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GameService} from '../service/game.service';
import {Move} from '../model/move';
import {Deck} from '../model/deck';
import {SessionService} from '../service/session.service';

@Component({
  selector: 'app-debug-client',
  templateUrl: './debug-client.component.html',
  styleUrls: ['./debug-client.component.css']
})
export class DebugClientComponent {

  constructor(protected websocketService: WebsocketService,
              public gameService: GameService,
              public sessionService: SessionService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) {
  }

  joinGame(whichGame: { game: string, deck?: Deck }): void {
    this.websocketService.joinGame(this.gameService.playerId, whichGame.game, (sdkEvent => {
      this.gameService.gameId = sdkEvent.body;
      this.websocketService.subToGame(
        this.gameService.gameId,
        this.gameService.playerId,
        (moveMessageEvent) => this.snackBar.open(moveMessageEvent.body, 'ok', {duration: 3000}),
        (illegalMoveMessageEvent) => this.snackBar.open(illegalMoveMessageEvent.body, 'ok', {duration: 1500}),
        (gameViewMessageEvent) => {
          this.sessionService.isLoadingGame = false;
          this.onGameUpdate(gameViewMessageEvent.body);
        }
      );
      this.websocketService.requestGameView(this.gameService.gameId, this.gameService.playerId);
    }), whichGame.deck);
  }

  playCard(event: Move): void {
    this.websocketService.submitMove(event);
  }

  onGameUpdate(gameStateRaw: any): void {
    this.gameService.gameState = JSON.parse(gameStateRaw);

    if (!this.gameService.gameState.over) {
      this.dialog.open(CodeDialogComponent, {
        width: 'fit-content',
        data: {
          title: this.getDialogTitle(),
          html: this.getDialogHtml(),
          jsonTextData: this.getDialogRawJsonTest()
        }
      }).afterClosed().subscribe(
        () => {
          if (this.getDialogTitle() !== 'Begin') {
            this.showEotEffects();
          }
        }
      );
    }

    if (this.gameService.gameState.over) {
      this.dialog.open(CodeDialogComponent, {
        width: 'fit-content',
        data: {
          title: 'WINNER: ' + this.gameService.gameState.winner,
          html: this.getDialogHtml(),
          jsonTextData: this.gameService.gameState.resolvedMoves
        }
      }).afterClosed().subscribe(
        () => {
          this.showEotEffects();
          this.gameService.clearGame();
        }
      );
      this.websocketService.unsubToGame(this.gameService.gameId, this.gameService.playerId);
    }
  }

  getDiscardableCards(): string[] {
    return this.gameService.cardsInHand
      .filter(card =>
        !card.characterBound && !card.basicAction && !card.lastResort)
      .map(card => card.name);
  }

  private getDialogTitle(): string {
    // if there are no last resolved moves, game is just begun
    return this.gameService.gameState.resolvedMoves.length === 0 ? 'Begin' : 'Turn Resolution';
  }

  private getDialogRawJsonTest(): any {
    return this.gameService.gameState.resolvedMoves.length === 0 ?
      this.getPlayersRawJsonText() : this.gameService.gameState.resolvedMoves;
  }

  private getPlayersRawJsonText(): any {
    return {
      you: this.gameService.playerId,
      opponents: this.gameService.opponents.map(o => o.playerId)
    };
  }

  private getDialogHtml(): string {
    return this.gameService.gameState.resolvedMoves.length === 0 ?
      this.getBeginGameHtml()
      : this.getMovesHtml();
  }

  private getBeginGameHtml(): string {
    return '<p><b>Player</b>: ' + this.gameService.playerId + '</p><p><b>Opponent</b>(s): <ul><li>'
      + this.gameService.opponents.map(o => o.playerId).reduce((a, b) => a + '</li><li>' + b) + '</li></ul></p>';
  }

  private getMovesHtml(): string {
    return this.gameService.gameState.resolvedMoves.map(m => {
      return '<p><b>' + m.playerId + '</b> ---> <b>' + m.targetId + '</b></p>'
        + '<p><b>' + m.playedCardName + '</b></p>'
        + ((!m.moveReport.SELF || m.moveReport.SELF.length === 0) ? ''
          : '<p>SELF: <ul><li>' + m.moveReport.SELF.reduce((a, b) => a + '</li><li>' + b) + '</li></ul>')
        + '</p>'
        + ((!m.moveReport.OPPONENT || m.moveReport.OPPONENT.length === 0) ? ''
          : '<p>TARGET: <ul><li>' + m.moveReport.OPPONENT.reduce((a, b) => a + '</li><li>' + b) + '</li></ul>')
        + '</p>';
    }).reduce((a, b) => a + '<br>' + b);
  }

  private getEotHtml(): string {
    const eot = this.gameService.gameState.timeBasedEffects; // shorten this name
    let html = '';
    Object.keys(eot).forEach(
      k => {
        if ((!eot[k] || eot[k].length === 0)) {
          return;
        } // no eot fx for that player
        html += '<p>';
        html += '<b>' + k + '</b>';
        html += '<ul><li>' + eot[k].reduce((a, b) => a + '</li><li>' + b) + '</li></ul>';
        html += '</p>';
      }
    );
    return html;
  }

  private showEotEffects(): void {
    this.dialog.open(CodeDialogComponent, {
      width: 'fit-content',
      data: {
        title: 'End of Turn Effects',
        html: this.getEotHtml(),
        jsonTextData: this.gameService.gameState.timeBasedEffects
      }
    });
  }
}
