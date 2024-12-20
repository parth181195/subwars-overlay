import {Component, inject} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router} from "@angular/router";
import {collection, Firestore, getDocs, query, where} from "@angular/fire/firestore";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {AsyncPipe} from "@angular/common";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-answers',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    AsyncPipe,
    MatCard
  ],
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.sass'
})
export class AnswersComponent {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  id = this.activatedRoute.snapshot.params['id'];
  private fs = inject(Firestore);
  private questionsCollection = collection(this.fs, 'answers');
  loading = true;
  answers: any[] = [];
  constructor() {
    getDocs(query(this.questionsCollection, where('questionId', '==', this.id)),).then((querySnapshot) => {
      this.answers =[];
      this.loading = false;
      querySnapshot.forEach((doc) => {
        this.answers.push({...doc.data(), id: doc.id});
      });
    });
  }

  backToQuestions() {
    this.router.navigate(['/questions']);
  }

}
