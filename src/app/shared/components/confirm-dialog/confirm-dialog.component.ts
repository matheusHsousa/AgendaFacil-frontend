import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  values: any

  constructor( @Inject(MAT_DIALOG_DATA) public data: string,
  private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  ngOnInit(): void {
    this.values = this.data;
  }

  Confirm(): void {
    this.dialogRef.close(true);
  }
}
