import {Injectable} from '@angular/core';
import {GameState} from '../model/game-state';
import {Opponent, Player} from '../model/player';
import {Card} from '../model/card';
import {Character} from '../model/character';
import {WebsocketService} from './websocket.service';
import {Move} from '../model/move';
import {Deck} from '../model/deck';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private websocketService: WebsocketService) {
  }

  // tslint:disable:variable-name
  private _graphicClient = true;

  private _gameId: string;
  private _playerId: string;
  private _gameState: GameState;
  private _gameType: { game: string, deck?: Deck }; // I really should make an interface for this

  clearGame(): void {
    this._gameId = null;
    this._gameState = null;
    this._gameType = null;
  }

  get gameType(): { game: string; deck?: Deck } {
    return this._gameType;
  }

  set gameType(value: { game: string; deck?: Deck }) {
    this._gameType = value;
  }

  get playerState(): Player {
    return this.gameState.players[this.playerId];
  }

  get opponents(): Opponent[] {
    const players = JSON.parse(JSON.stringify(this.gameState.players));
    const opp = [];
    Object.keys(players).forEach(k => {
      if (k !== this.playerId) {
        opp.push(players[k]);
      }
    });
    return opp.filter(o => !o.character.dead);
  }

  get cardsInHand(): Card[] {
    if (this.gameState) {
      return this.gameState.players[this.playerId].cardsInHand;
    }
  }

  get playerId(): string {
    return this._playerId;
  }

  set playerId(value: string) {
    this._playerId = value;
  }

  get gameState(): GameState {
    return this._gameState;
  }

  set gameState(value: GameState) {
    this._gameState = value;
  }

  get gameId(): string {
    return this._gameId;
  }

  set gameId(value: string) {
    this._gameId = value;
  }

  get graphicClient(): boolean {
    return this._graphicClient;
  }

  set graphicClient(value: boolean) {
    this._graphicClient = value;
  }

  getCardObjFromName(name: string): Card {
    for (const c of this.cardsInHand) {
      if (c.name === name) {
        return c;
      }
    }
    return null;
  }

  // bouncing this to not "inject" another service in phaser game scene
  submitMove(move: Move): void {
    this.websocketService.submitMove(move);
  }

  isPlayable(card: Card, character: Character): boolean {
    if (this.getTargets(card).length <= 0) {
      return false;
    }
    for (const key in card.cost) {
      if (!character.resources[key] || character.resources[key] < card.cost[key]) {
        return false;
      }
    }
    return true;
  }

  getTargets(card: Card): string[] {
    const targets = [];
    if (card.canTarget.includes('SELF')) {
      targets.push('SELF');
    }
    if (card.canTarget.includes('OPPONENT')) {
      this.opponents.map(o => o.playerId)
        .forEach(o => targets.push(o));
    }
    if (JSON.stringify(card.canTarget).includes('NEAR_ITEM')) {
      this.playerState.character.items.map(i => 'SELF.' + i.name)
        .forEach(o => targets.push(o));
    }
    if (JSON.stringify(card.canTarget).includes('FAR_ITEM')) {
      this.opponents.forEach(
        o => o.character.items.map(i => o.playerId + '.' + i.name)
          .forEach(oppItems => targets.push(oppItems))
      );
    }
    return targets;
  }

}
