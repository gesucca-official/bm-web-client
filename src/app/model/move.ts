export interface Move {
  playedCardName: string;
  playerId: string;
  targetId: string;
  gameId: string;
  choices: Choices;
  moveReport?: MoveReport;
}

export interface Choices {
  [action: string]: string;
}

export interface MoveReport {
  SELF: string[];
  OPPONENT: string[];
}
