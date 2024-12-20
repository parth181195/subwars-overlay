import {Routes} from '@angular/router';
import {OverlayComponent} from "./components/overlay/overlay.component";
import {QuestionsComponent} from "./components/questions/questions.component";
import {AnswersComponent} from "./components/answers/answers.component";

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
    path: 'questions',
    component: QuestionsComponent
  },
  {
    path:'answer/:id',
    component: AnswersComponent
  }
];
