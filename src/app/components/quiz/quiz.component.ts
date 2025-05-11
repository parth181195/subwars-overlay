import {Component, inject} from '@angular/core';
import {AsyncPipe, NgClass} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {AddQuizComponent} from "../pop-ups/add-quiz/add-quiz.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {QuizI} from "../../types/quiz.type";
import {WithUID} from "../../types/generic.type";
import {AfsService} from "../../services/afs.service";
import {BehaviorSubject} from "rxjs";
import {MatRipple, MatRippleModule} from "@angular/material/core";
import {ConfirmationComponent} from "../pop-ups/confirmation/confirmation.component";
import {LoaderComponent} from "../loader/loader.component";

@Component({
  selector: 'app-quiz',
  imports: [
    MatCard,
    MatButton,
    AsyncPipe,
    MatIconButton,
    MatIcon,
    NgClass,
    MatRippleModule,
    MatMenuModule,
    MatToolbarModule,
    LoaderComponent
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {
  router = inject(Router);
  readonly dialog = inject(MatDialog);
  quizzes: Array<QuizI & WithUID & { questions: number }> = []
  loading = {
    loading: new BehaviorSubject(true),
    quiz: new BehaviorSubject(false),
    delete: new BehaviorSubject(false),
  }
  afs = inject(AfsService)

  constructor() {
    this.getQuizzes()
  }

  async addQuiz() {
    let dialogRef = this.dialog.open(AddQuizComponent, {
      width: '600px',
      data: {text: ''},
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result?.text || result?.text == '') return;
      const id = await this.afs.addQuiz({name: result.text});
      this.quizzes.push({name: result.text, uid: id, questions: 0});
    });
  }


  editQuiz(question: QuizI & WithUID) {
    let dialogRef = this.dialog.open(AddQuizComponent, {
      width: '600px',
      data: {text: question.name, isEditing: true},
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (!result?.text || result?.text == '') return;
      this.loading.quiz.next(true);
      this.afs.editQuiz({...question, name: result.text}).then(v => {
        this.loading.quiz.next(false);
        this.getQuizzes()
      });
    });
  }


  deleteQuiz(id: string) {
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '600px', data: {
        text: 'This action is not reversible. Are you sure you want to delete the Quiz? please take backup before deleting.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.delete) {
        this.loading.quiz.next(true);
        this.afs.deleteQuiz(id).then(v => {
          this.loading.quiz.next(false);
          this.getQuizzes()
        });
      }
    });
  }

  private getQuizzes() {
    this.loading.loading.next(true);
    this.afs.getQuizzes().then(value => {
      this.quizzes = value;
      this.loading.loading.next(false);
    }).catch(e => {
      console.error(e);
    })
  }

  goToQuiz(uid: string) {
    this.router.navigate([ uid, 'questions'], {relativeTo: this.router.routerState.root.firstChild});
  }
}


