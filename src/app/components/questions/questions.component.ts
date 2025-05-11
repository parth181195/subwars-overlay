import {Component, inject} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {AsyncPipe, JsonPipe, NgClass} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AddQuestionComponent} from "../pop-ups/add-question/add-question.component";
import {QuizI} from "../../types/quiz.type";
import {WithUID} from "../../types/generic.type";
import {AfsService} from "../../services/afs.service";
import {BehaviorSubject} from "rxjs";
import {LoaderComponent} from "../loader/loader.component";
import {QuestionI} from "../../types/question.type";

@Component({
  selector: 'app-questions',
  imports: [
    MatCard,
    MatButton,
    AsyncPipe,
    MatIconButton,
    MatIcon,
    NgClass,
    MatMenuModule,
    MatToolbarModule,
    LoaderComponent
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent {
  quiz: QuizI & WithUID;
  questions: Array<QuestionI & WithUID> = [];
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router)
  afs = inject(AfsService)
  readonly dialog = inject(MatDialog);
  loading = {
    initial: new BehaviorSubject(true),
  }

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      const quizId = params['id'];
      this.getQuiz(quizId);
      this.getQuestions(quizId);
    })
  }

  getQuiz(quizId: string) {
    this.loading.initial.next(true);
    if (quizId) {
      this.afs.getQuiz(quizId).then(quiz => {
        this.quiz = {...quiz.data(), uid: quizId} as QuizI & WithUID;
        console.log(this.quiz)
        this.loading.initial.next(false);
      })
    }
  }

  getQuestions(quizId: string) {
    this.afs.getQuestions(quizId).then(questions => {
      questions.docs.forEach((question: any) => {
        this.questions.push({
          ...question.data(),
          uid: question.id
        })
      })
    })
  }

  addQuestion() {
    let dialogRef = this.dialog.open(AddQuestionComponent, {
      width: '600px',
      data: {text: ''},
    });
  }

}


