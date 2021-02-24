import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Deck} from '../../../model/deck';
import {SessionService} from '../../../service/session.service';
import {Collection} from '../../../model/user-account-data';
import {Card} from '../../../model/card';

@Component({
  selector: 'app-edit-deck',
  templateUrl: './edit-deck.component.html',
  styleUrls: ['./edit-deck.component.css']
})
export class EditDeckComponent implements OnInit {

  collection: Collection = this.sessionService.userAccountData.collection;

  showDeckToggle = false;
  collectionSearchTerm: string;
  collectionCardsShown: Card[];

  @Input() deck: Deck;
  @Output() saveDeck: EventEmitter<Deck> = new EventEmitter<Deck>();
  @Output() exit: EventEmitter<void> = new EventEmitter<void>();

  constructor(public sessionService: SessionService) {
  }

  filterBasicActionCards(): Card[] {
    const filtered = [];
    this.collection.cards.forEach(c => {
      if (c.basicAction) {
        filtered.push(c);
      }
    });
    return filtered;
  }

  filterLastResortCards(): Card[] {
    const filtered = [];
    this.collection.cards.forEach(c => {
      if (c.lastResort) {
        filtered.push(c);
      }
    });
    return filtered;
  }

  filterCharacterBoundCards(): Card[] {
    const filtered = [];
    this.collection.cards.forEach(c => {
      if (c.characterBound && this.deck.character && c.boundToCharacter === this.deck.character.bindingName) {
        filtered.push(c);
      }
    });
    return filtered;
  }

  searchCollectionCards(): void {
    this.collectionCardsShown = [];
    this.collection.cards.forEach(c => {
      if (JSON.stringify(c).toUpperCase().includes(this.collectionSearchTerm.toUpperCase())) {
        this.collectionCardsShown.push(c);
      }
    });
  }

  changeCardShownByToggle(): void {
    this.collectionCardsShown = [];
    if (this.showDeckToggle) {
      this.collectionCardsShown = this.deck.regularCards;
    } else {
      this.collection.cards.forEach(c => {
        if (!c.characterBound && !c.lastResort && !c.basicAction) {
          this.collectionCardsShown.push(c);
        }
      });
    }
  }

  ngOnInit(): void {
    this.changeCardShownByToggle();
  }

  addOrRemoveFromDeck(card: Card): void {
    if (this.showDeckToggle) {
      // delete one from deck
      const index = this.deck.regularCards.findIndex(obj => obj.name === card.name);
      if (index > -1) {
        this.deck.regularCards.splice(index, 1);
      }
    } else {
      this.deck.regularCards.push(card);
    }
  }

  saveDeckAction(): void {
    this.saveDeck.emit(this.deck);
  }

  exitAction(): void {
    this.exit.emit();
  }

  isDeckValid(): boolean {
    return this.deck.regularCards.length === 20
      && this.deck.characterBoundCards.length === 2
      && this.deck.deckId !== null
      && this.deck.character !== null
      && this.deck.basicActionCard !== null
      && this.deck.lastResortCard !== null;
  }

  addCharacterBoundCard(card: Card): void {
    this.deck.characterBoundCards.push(card);
    if (this.deck.characterBoundCards.length > 2) {
      this.deck.characterBoundCards.splice(0, 1);
    }
  }

  getCharBoundCardsNames(): string {
    if (this.deck.characterBoundCards.length === 0) {
      return 'Not Chosen';
    } else {
      return this.deck.characterBoundCards.map(c => c.name).join(', ');
    }
  }
}
