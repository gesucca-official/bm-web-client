import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../model/player";
import {MatDialog} from "@angular/material/dialog";
import {CodeDialogComponent} from "../code-dialog/code-dialog.component";
import {Card} from "../../model/card";

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css']
})
export class CharacterCardComponent implements OnInit {

  @Input() playerState: Player;
  @Input() isPlayer: boolean;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  logState() {
    console.log(this.playerState);
  }

  get health(): number {
    return this.playerState.character.resources['HEALTH'];
  }

  get alertness(): number {
    return this.playerState.character.resources['ALERTNESS'];
  }

  get otherResources(): Map<string, number> {
    const res = JSON.parse(JSON.stringify(this.playerState.character.resources));
    delete res['HEALTH']
    delete res['ALERTNESS']
    return res;
  }

  logItem(item: Card) {
    this.dialog.open(CodeDialogComponent, {
      width: 'fit-content',
      data: {
        title: item.name,
        html: item.effect,
        jsonTextData: item
      }
    })
  }
}
