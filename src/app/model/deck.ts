import {Character} from './character';
import {Card} from './card';

export interface Deck {
  deckId: string;
  character: Character;
  basicActionCard: Card;
  lastResortCard: Card;
  characterBoundCards: Card[];
  regularCards: Card[];
}
