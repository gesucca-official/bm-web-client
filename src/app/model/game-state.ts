import {Move} from './move';
import {Player} from './player';

export interface GameState {
  gameId: string;
  players: Players;
  resolvedMoves: Move[];
  timeBasedEffects: TimeBasedEffects;
  over: boolean;
  winner: string;
}

export interface Players {
  [id: string]: Player;
}

export interface TimeBasedEffects {
  [player: string]: string[];
}
