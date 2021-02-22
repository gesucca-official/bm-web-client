import {Component, Inject} from '@angular/core';
import {CodeDialogData} from "./code-dialog-data";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-code-dialog',
  templateUrl: './code-dialog.component.html',
  styleUrls: ['./code-dialog.component.css']
})
export class CodeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: CodeDialogData) {
  }

  logRawJson() {
    console.log(this.dialogData.jsonTextData);
  }
}
