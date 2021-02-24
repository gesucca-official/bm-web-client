import {Injectable} from '@angular/core';
import {QueuedUser, User} from '../model/user';
import {UserAccountData} from '../model/user-account-data';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // tslint:disable:variable-name
  private _queued: boolean;
  private _queuedFor: string;

  private _usersConnected: User[] = [];
  private _usersInCurrentQueue: QueuedUser[] = [];

  private _userAccountData: UserAccountData = {
    username: null,
    email: null,
    role: null,
    decks: [],
    collection: {
      characters: [],
      cards: []
    }
  };

  private _isWaitingForUserAccountData = false;
  private _isLoadingGame = false;

  get queued(): boolean {
    return this._queued;
  }

  set queued(value: boolean) {
    this._queued = value;
  }

  get queuedFor(): string {
    return this._queuedFor;
  }

  set queuedFor(value: string) {
    this._queuedFor = value;
  }

  get usersInCurrentQueue(): QueuedUser[] {
    return this._usersInCurrentQueue;
  }

  set usersInCurrentQueue(value: QueuedUser[]) {
    this._usersInCurrentQueue = value;
  }

  get howManyUsersConnected(): number {
    return this._usersConnected.length;
  }

  get usersConnected(): User[] {
    return this._usersConnected;
  }

  set usersConnected(value: User[]) {
    this._usersConnected = value;
  }

  get userAccountData(): UserAccountData {
    return this._userAccountData;
  }

  set userAccountData(value: UserAccountData) {
    this._isWaitingForUserAccountData = false;
    this._userAccountData = value;
  }

  get isWaitingForUserAccountData(): boolean {
    return this._isWaitingForUserAccountData;
  }

  set isWaitingForUserAccountData(value: boolean) {
    this._isWaitingForUserAccountData = value;
  }

  get isLoadingGame(): boolean {
    return this._isLoadingGame;
  }

  set isLoadingGame(value: boolean) {
    this._isLoadingGame = value;
  }

}
