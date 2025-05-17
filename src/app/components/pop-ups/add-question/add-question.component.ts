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
import {QUESTION_TYPES, QuestionI} from "../../../types/question.type";
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";
import {MatSelectModule} from "@angular/material/select";
import {BunnyService} from "../../../services/bunny.service";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AfsService} from "../../../services/afs.service";
import {WithUID} from "../../../types/generic.type";

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
    MatDialogTitle,
    MatSelectModule,
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.sass'
})
export class AddQuestionComponent {

  basePath = 'http://df24.b-cdn.net/pasoll/questions';
  readonly dialogRef = inject(MatDialogRef<AddQuestionComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  questionText: ModelSignal<string> = model(this.data.questionText ?? '');
  answer: ModelSignal<string> = model(this.data.answer ?? '');
  questionMedia: ModelSignal<string> = model(this.data.questionMedia ?? '');
  answerMedia: ModelSignal<string> = model(this.data.answerMedia ?? '');
  questionType: ModelSignal<QUESTION_TYPES> = model(this.data.questionType ?? QUESTION_TYPES.TEXT);
  bunny = inject(BunnyService)
  afs = inject(AfsService);
  isEditing = !!this.data.isEditing;
  id = this.data.id ?? this.afs.getNewQuestionId();
  readonly QuestionTypes = QUESTION_TYPES;
  readonly obj = Object
  loader = {
    image: new BehaviorSubject(false),
  }

  constructor() {

  }


  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    const payload: QuestionI & WithUID = {
      active: false,
      uid: this.id,
      questionText: this.questionText(),
      answer: this.answer(),
      questionType: this.questionType(),
      questionMedia: this.questionMedia(),
      answerMedia: this.answerMedia(),
    }
    this.dialogRef.close({
      ...payload
    });
  }

  onFileSelected(event: Event, isQuestion: boolean = true): void {
    const input = event.target as HTMLInputElement;
    const allowedTypes = ['image/png', 'image/jpeg', 'audio/mpeg', 'audio/wav'];

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type. Only PNG, JPG, MP3, and WAV are allowed.');
        return;
      }
      this.loader.image.next(true);
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
      const path = `/${this.id}/${this.id}_${isQuestion ? 'q' : 'a'}.${ext}`;
      this.bunny.putFileToBunny(file, this.id, isQuestion).subscribe({
        next: (response) => {
          this.loader.image.next(false);
          console.log('File uploaded successfully:', response);
          if (isQuestion) {
            this.questionMedia.set(path);
          } else {
            this.answerMedia.set(path);
          }
        },
        error: (error) => {
          this.loader.image.next(false);
          console.error('Error uploading file:', error);
        }
      })
    }
  }

  shouldDisable() {
    switch (this.questionType()) {
      case QUESTION_TYPES.TEXT:
        return !this.questionText() || !this.answer();
      case QUESTION_TYPES.IMAGE:
        return !this.questionText() || !this.answerMedia() || !this.questionMedia() || !this.answer();
      case QUESTION_TYPES.AUDIO:
        return !this.questionText() || !this.answerMedia() || !this.questionMedia() || !this.answer();
      default:
        return false;
    }
  }
}
