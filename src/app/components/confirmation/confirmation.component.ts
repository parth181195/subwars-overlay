import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.sass'
})
export class ConfirmationComponent {

  readonly dialogRef = inject(MatDialogRef<ConfirmationComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  confirmDelete() {
    this.dialogRef.close({delete: true})
  }
}
