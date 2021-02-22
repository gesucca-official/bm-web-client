import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CodeDialogData} from "../../../client-debug/code-dialog/code-dialog-data";
import {CodeDialogComponent} from "../../../client-debug/code-dialog/code-dialog.component";
import {SessionService} from "../../../service/session.service";
import {Deck} from "../../../model/deck";

@Component({
  selector: 'app-choose-deck-dialog',
  templateUrl: './choose-deck-dialog.component.html',
  styleUrls: ['./choose-deck-dialog.component.css']
})
export class ChooseDeckDialogComponent {

  chosenDeck: Deck = null;

  constructor(public sessionService: SessionService,
              public dialogRef: MatDialogRef<CodeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: CodeDialogData) {
  }

  ok(): void {
    this.dialogRef.close(this.chosenDeck);
  }

}
