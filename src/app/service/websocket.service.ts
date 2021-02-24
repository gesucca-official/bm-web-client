import {Injectable} from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {Move} from '../model/move';
import {SessionService} from './session.service';
import {Deck} from '../model/deck';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(protected sessionService: SessionService) {
    this.subscriptions = new Map<string, any>();
    this.connected = false;
  }

  private stompClient: any; // dunno which type this is

  private connected: boolean;

  private subscriptions: Map<string, any[]>;

  private static inferJoinGameEndpoint(gameType: string): string {
    if (gameType.includes('Com')) {
      return '/user/queue/game/' + gameType + '/ready';
    } else {
      return '/topic/game/' + gameType + '/ready';
    }
  }

  public connect(username: string, password: string, callback: () => void): void {
    this.stompClient = Stomp.over(new SockJS('/ws'));
    this.stompClient.connect({
      login: username,
      passcode: password
    }, () => {
      this.connected = true;

      this.stompClient.subscribe('/topic/connections/users',
        (sdkEvent) => this.sessionService.usersConnected = JSON.parse(sdkEvent.body));
      this.stompClient.send('/app/connections/users/tell/me', {});

      this.stompClient.subscribe('/user/queue/user/' + username + '/account',
        (sdkEvent) => this.sessionService.userAccountData = JSON.parse(sdkEvent.body));

      this.stompClient.send('/app/user/' + username + '/account', {});
      this.sessionService.isWaitingForUserAccountData = true;

      callback();
    });
  }

  public isConnected(): boolean {
    return this.connected;
  }

  // these deck methods maybe have to go somewhere else
  public saveDeck(username: string, deck: Deck): void {
    this.sessionService.isWaitingForUserAccountData = true;
    this.stompClient.send('/app/user/' + username + '/deck', {}, JSON.stringify(deck));
  }

  public deleteDeck(username: string, deck: Deck): void {
    this.sessionService.isWaitingForUserAccountData = true;
    this.stompClient.send('/app/user/' + username + '/deck/delete', {}, JSON.stringify(deck));
  }

  public joinGame(playerId: string, gameType: string, callback: (sdkEvent) => void, deck?: Deck): void {
    this.sessionService.queued = true;
    this.sessionService.queuedFor = gameType.split('/')[1]; // TODO come on this is nowhere near being safe
    if (gameType.includes('ffa'))
      // TODO this never gets unsubscribed from
    {
      this.stompClient.subscribe('/topic/game/' + gameType + '/joined',
        (sdkEvent) => this.sessionService.usersInCurrentQueue = JSON.parse(sdkEvent.body));
    }

    // no need to save this sub cause it will unsubscribe on completion
    const subscription = this.stompClient.subscribe(WebsocketService.inferJoinGameEndpoint(gameType), (sdkEvent) => {
      subscription.unsubscribe();
      this.sessionService.queued = false;
      this.sessionService.queuedFor = null;
      callback(sdkEvent);
    });
    this.stompClient.send('/app/game/' + gameType + '/join' +
      (gameType.includes('open') ? '/' + playerId + '/' + deck.deckId : '')
      , {}, playerId);
  }

  public addComToGame(): void {
    // no subs here cause user is already joined and subbed
    this.stompClient.send('/app/game/quick/ffa/join/com', {});
  }

  public forceStartFfaGame(): void {
    // as above
    this.stompClient.send('/app/game/quick/ffa/start', {});
  }

  public subToGame(gameId: string,
                   playerId: string,
                   movesCallback: (sdkEvent) => void,
                   illegalMoveCallback: (sdkEvent) => void,
                   gameViewCallback: (sdkEvent) => void
  ): void {
    const gameSubs = new Array<any>();

    // when there's an update about the game get your updated view view
    gameSubs.push(
      this.stompClient.subscribe('/topic/game/' + gameId + '/update', () => {
          this.requestGameView(gameId, playerId);
        }
      ));
    // alert about other players moves
    gameSubs.push(
      this.stompClient.subscribe('/topic/game/' + gameId + '/move', movesCallback)
    );
    // alert player when he select an illegal move
    gameSubs.push(
      this.stompClient.subscribe('/user/queue/player/action/illegalMove', illegalMoveCallback)
    );
    // update game when receiving a new view
    gameSubs.push(
      this.stompClient.subscribe('/user/queue/game/' + gameId + '/' + playerId + '/view', gameViewCallback)
    );

    // save everything to unsubscribe later
    this.subscriptions.set(gameId, gameSubs);
  }

  public requestGameView(gameId: string, playerId: string): void {
    this.stompClient.send('/app/game/' + gameId + '/' + playerId + '/view', {});
  }

  // don't know if coupling Move class with this service is good
  public submitMove(move: Move): void {
    this.stompClient.send('/app/game/' + move.gameId + '/move', {}, JSON.stringify(move));
  }

  public unsubToGame(gameId: string, playerId: string): void {
    this.stompClient.send('/app/game/' + gameId + '/' + playerId + '/leave', {});
    this.subscriptions.get(gameId).forEach(sub => sub.unsubscribe());
    this.subscriptions.delete(gameId);
  }
}
