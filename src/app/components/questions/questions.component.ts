import {Component, inject} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  collection,
  Firestore,
  addDoc,
  setDoc,
  collectionData,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
  where, query
} from "@angular/fire/firestore";
import {MatDialog} from "@angular/material/dialog";
import {AddQuestionComponent} from "./add-question/add-question.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AsyncPipe, JsonPipe, NgClass} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatCheckbox} from "@angular/material/checkbox";
import {Router} from "@angular/router";

@Component({
    selector: 'app-questions',
    imports: [
        MatCard,
        MatButton,
        AsyncPipe,
        JsonPipe,
        MatIconButton,
        MatIcon,
        MatCheckbox,
        NgClass
    ],
    templateUrl: './questions.component.html',
    styleUrl: './questions.component.sass'
})
export class QuestionsComponent {
  firestore = inject(Firestore);
  snackBar = inject(MatSnackBar);
  router =  inject(Router);
  questionsCollection = collection(this.firestore, 'questions');
  questions$ = collectionData<any>(this.questionsCollection, {idField: 'id'});
  readonly dialog = inject(MatDialog);

  addQuestion() {
    let dialogRef = this.dialog.open(AddQuestionComponent, {
      width: '600px',
      data: {text: ''},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.addQuestionToFS(result.text);
    });
  }

  addQuestionToFS(text: string) {
    addDoc(this.questionsCollection, {text: text, active: false}).then(() => {
      this.snackBar.open('Question added', 'Close',)
    });
  }

  setQuestionToFS(text: string, id: string) {
    const docRef = doc(this.questionsCollection, id);
    setDoc(docRef, {text: text, active: false}).then(() => {
      this.snackBar.open('Question added', 'Close',)
    });
  }

  editQuestion(question: { text: string, id: string }) {
    let dialogRef = this.dialog.open(AddQuestionComponent, {
      width: '600px',
      data: {text: question.text, isEditing: true},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.setQuestionToFS(result.text, question.id);
    });
  }

  deleteQuestion(id: string) {
    const docRef = doc(this.questionsCollection, id);

    deleteDoc(docRef).then(() => {
      this.snackBar.open('Question deleted', 'Close',);
    });
  }

  setActiveQuestion(id: string, state: boolean) {
    getDocs(query(this.questionsCollection, where('active', '==', true))).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        const docRef = doc(this.questionsCollection, id);
        updateDoc(docRef, {active: state}).then(() => {
          this.snackBar.open('Question set active', 'Close',);
        });
        return;
      }
      Promise.all(querySnapshot.docs.map((doc) => {
        return updateDoc(doc.ref, {active: false});
      })).then(() => {
        const docRef = doc(this.questionsCollection, id);
        updateDoc(docRef, {active: state}).then(() => {
          this.snackBar.open('Question set active', 'Close',);
        });
      });
    });
  }

  deactivateAllQuestions() {
    getDocs(query(this.questionsCollection, where('active', '==', true))).then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((doc) => {
        return updateDoc(doc.ref, {active: false});
      })).then(() => {
        this.snackBar.open('All questions Deactivated', 'Close',);
      });
    });
  }

  deactivateQuestion(id: string) {
    const docRef = doc(this.questionsCollection, id);
    updateDoc(docRef, {active: false}).then(() => {
      this.snackBar.open('Question Deactivated', 'Close',);
    });
  }

  goToAnswer(id) {
    this.router.navigate(['/answer', id]);
  }
}


