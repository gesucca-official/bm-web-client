import {Card} from "./card";
import {Deck} from "./deck";
import {Character} from "./character";

export interface UserAccountData {
  username: string,
  email: string,
  role: string
  decks: Deck[],
  collection: Collection
}

export interface Collection {
  characters: Character[],
  cards: Card[]
}
