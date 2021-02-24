import {Component} from '@angular/core';
import {SessionService} from '../../service/session.service';
import {Deck} from '../../model/deck';
import {WebsocketService} from '../../service/websocket.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent {

  editing = false;
  targetDeck: Deck;

  constructor(public sessionService: SessionService, public websocketService: WebsocketService) {
  }

  newDeck(): void {
    this.editing = true;
    this.targetDeck = {
      deckId: null,
      character: null,
      basicActionCard: null,
      lastResortCard: null,
      characterBoundCards: [],
      regularCards: []
    };
  }

  editDeck(deck: Deck): void {
    this.editing = true;
    this.targetDeck = deck;
  }

  saveDeck(deck: Deck): void {
    this.websocketService.saveDeck(this.sessionService.userAccountData.username, deck);
  }

  deleteDeck(deck: Deck): void {
    this.websocketService.deleteDeck(this.sessionService.userAccountData.username, deck);
  }
}
