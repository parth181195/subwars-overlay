import {Component, inject, model} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-quiz',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    FormsModule
  ],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.sass'
})
export class AddQuizComponent {
  readonly dialogRef = inject(MatDialogRef<AddQuizComponent>);
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
