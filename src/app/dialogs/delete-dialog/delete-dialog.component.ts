import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  deleteFunction: any;
  deleteInputName: string = '';
  isValid = false;
  name: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<DeleteDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.deleteFunction = this.data.deleteFunction;
    this.name = this.data.name;
  }

  compareValues(){
    if(this.name==this.deleteInputName) {
      this.isValid = true;
      return;
    }
      this.isValid = false;

  }

  deleteElement() {
    this.deleteFunction();
    this.onClose();
  }

  onClose() {
    this._dialogRef.close();
  }
}
