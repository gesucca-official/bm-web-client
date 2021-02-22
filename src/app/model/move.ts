export interface Move {
  playedCardName: string,
  playerId: string,
  targetId: string,
  gameId: string,
  choices: Choices,
  moveReport?: Map<string, string[]>
}

export interface Choices {
  [action: string]: string;
}
