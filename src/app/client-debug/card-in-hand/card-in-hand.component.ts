import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Card} from '../../model/card';
import {Move} from '../../model/move';
import {GameService} from '../../service/game.service';
import {Character} from '../../model/character';

@Component({
  selector: 'app-card-in-hand',
  templateUrl: './card-in-hand.component.html',
  styleUrls: ['./card-in-hand.component.css']
})
export class CardInHandComponent {

  @Input() cardData: Card;
  @Input() targets: string[];
  @Input() chosenTarget: string;

  @Input() discardableCards: string[];
  @Input() cardToDiscard: string;

  @Input() character: Character;

  @Output() cardPlayedEvent: EventEmitter<Move> = new EventEmitter<Move>();

  constructor(public gameService: GameService) {
  }

  logState(): void {
    console.log(this.cardData);
  }

  playThis(): void {
    this.cardPlayedEvent.emit({
      playedCardName: this.cardData.name,
      playerId: this.gameService.playerId,
      targetId: this.chosenTarget.split('.')[0],
      gameId: this.gameService.gameId,
      choices: this.cardData.characterBound ? {DISCARD_ONE: this.cardToDiscard} :
        this.cardData.canTarget.includes('NEAR_ITEM') || this.cardData.canTarget.includes('FAR_ITEM') ?
          {TARGET_ITEM: this.chosenTarget.split('.')[1]} : null
    });
  }

  getColor(): string {
    if (this.cardData.characterBound) {
      return 'rgb(255,255,205)';
    }
    if (this.cardData.basicAction) {
      return 'rgb(100,195,255)';
    }
    if (this.cardData.lastResort) {
      return 'rgb(225,105,105)';
    }
  }
}
