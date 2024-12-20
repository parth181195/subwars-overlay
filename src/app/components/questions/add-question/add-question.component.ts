import {Component, inject, model} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    MatLabel,
    MatInput,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.sass'
})
export class AddQuestionComponent {
  readonly dialogRef = inject(MatDialogRef<AddQuestionComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  text = model(this.data.text ?? '');
  isEditing = !!this.data.isEditing;

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({text: this.text()});
  }
}
