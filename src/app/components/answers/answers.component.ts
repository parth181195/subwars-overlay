import {Component, inject} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router} from "@angular/router";
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
  collectionChanges,
  getDoc,
  doc,
  deleteDoc
} from "@angular/fire/firestore";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {AsyncPipe, NgClass} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {UserPopupComponent} from "../user-popup/user-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {saveAs} from 'file-saver';
import {ConfirmationComponent} from "../pop-ups/confirmation/confirmation.component";

@Component({
  selector: 'app-answers',
  imports: [
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    MatCard,
    NgClass
  ],
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.sass'
})
export class AnswersComponent {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  id = this.activatedRoute.snapshot.params['id'];
  private fs = inject(Firestore);
  private answersCollection = collection(this.fs, 'answers');
  private usersCollection = collection(this.fs, 'users');
  private questionCollection = collection(this.fs, 'questions');
  loading = true;
  answers: any[] = [];
  readonly dialog = inject(MatDialog);
  question: any;

  constructor() {
    this.getDocsFromFS();
    collectionChanges(this.questionCollection).subscribe((querySnapshot) => {
      this.showQuestionData();
    })
    collectionChanges(query(this.answersCollection, where('questionId', '==', this.id)),).subscribe((querySnapshot) => {
      this.getDocsFromFS()
    })
  }

  getDocsFromFS() {
    getDocs(query(this.answersCollection, where('questionId', '==', this.id)),).then((querySnapshot) => {
      this.answers = [];
      this.loading = false;
      querySnapshot.forEach((doc) => {
        this.answers.push({...doc.data(), id: doc.id});
      });
    });
  }

  backToQuestions() {
    this.router.navigate(['/questions']);
  }

  showQuestionData() {
    getDoc(doc(this.fs, 'questions', this.id)).then((doc) => {
      console.log(doc.data())
      this.question = doc.data()
    })
  }

  showUserData(id: string, name) {
    console.log(id)
    let dialogRef = this.dialog.open(UserPopupComponent, {
      width: '600px',
      data: {id, name},
    });
  }

  deleteAnswer() {
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (!result.delete) return;
      this.answers.forEach((answer) => {
        deleteDoc(doc(this.fs, 'answers', answer.id));
      });
    })
  }

  downloadJson() {
    console.log(JSON.stringify(this.answers))
    const blob = new Blob([JSON.stringify(this.answers)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${this.id}-${this.question.text}.json`);
  }
}
