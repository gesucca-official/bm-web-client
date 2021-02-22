import {Component, Input} from '@angular/core';
import {Card} from "../../../model/card";

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css']
})
export class CollectionCardComponent {

  @Input() card: Card;

  constructor() {
  }

}
