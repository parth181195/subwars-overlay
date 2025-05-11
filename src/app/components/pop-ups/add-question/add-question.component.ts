import {Component, inject, model, ModelSignal} from '@angular/core';
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
import {QUESTION_TYPES} from "../../../types/question.type";

@Component({
  selector: 'app-add-question',
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
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
  active: boolean;
  questionText: ModelSignal<string> = model(this.data.questionText ?? '');
  answer: ModelSignal<string> = model(this.data.answer ?? '');
  questionImage: ModelSignal<string> = model(this.data.questionImage ?? '');
  answerImage: ModelSignal<string> = model(this.data.answerImage ?? '');
  questionType: ModelSignal<QUESTION_TYPES> = model(this.data.questionType ?? QUESTION_TYPES.TEXT);
  isEditing = !!this.data.isEditing;

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({text: this.text()});
  }
}
