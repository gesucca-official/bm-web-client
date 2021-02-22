import {Resources} from "./character";

export interface Card {
  name: string,
  cost: Resources,
  effect: string,
  priority: number
  canTarget: string[],
  basicAction: boolean;
  characterBound: boolean,
  boundToCharacter: string,
  lastResort: boolean

  image: string,
  sprite: string
}
