import {Component, Inject} from '@angular/core';
import {CodeDialogData} from './code-dialog-data';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-code-dialog',
  templateUrl: './code-dialog.component.html',
  styleUrls: ['./code-dialog.component.css']
})
export class CodeDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: CodeDialogData) {
  }

  logRawJson(): void {
    console.log(this.dialogData.jsonTextData);
  }
}
