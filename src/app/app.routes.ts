import {Routes} from '@angular/router';
import {OverlayComponent} from "./components/overlay/overlay.component";
import {QuestionsComponent} from "./components/questions/questions.component";
import {AnswersComponent} from "./components/answers/answers.component";
import {RootPageComponent} from "./components/root-page/root-page.component";
import {QuizComponent} from "./components/quiz/quiz.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overlay'
  },
  {
    path: 'overlay',
    component: OverlayComponent
  },
  {
    path: 'qna',
    component: RootPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'quiz'
      },
      {
        path: 'quiz',
        component: QuizComponent,

      },
      {
        path: ':id/questions',
        component: QuestionsComponent
      },
      {
        path: ':id/answer/:id',
        component: AnswersComponent
      }
    ]
  }
];
