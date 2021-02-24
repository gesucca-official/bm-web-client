import {Component, Input} from '@angular/core';
import {Character} from '../../../model/character';

@Component({
  selector: 'app-collection-character-card',
  templateUrl: './collection-character-card.component.html',
  styleUrls: ['./collection-character-card.component.css']
})
export class CollectionCharacterCardComponent {

  @Input() character: Character;

  constructor() {
  }

}
