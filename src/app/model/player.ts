import {Character} from "./character";
import {Card} from "./card";

export interface Player {
  playerId: string
  character: Character,
  cardsInHand: Card[],
  deckSize: number,
}

export interface Opponent extends Omit<Player, 'cardsInHand'> {
  cardsInHand: number
}
