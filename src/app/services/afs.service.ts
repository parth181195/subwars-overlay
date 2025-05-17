import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "@angular/fire/firestore";
import {CollectionNames} from "../constants/collection.names";
import {QuizI} from "../types/quiz.type";
import {WithUID} from "../types/generic.type";
import {QuestionI} from "../types/question.type";

@Injectable({
  providedIn: 'root'
})
export class AfsService {
  afs = inject(Firestore)
  private quizCollection = collection(this.afs, CollectionNames.quiz)
  private questionCollection = collection(this.afs, CollectionNames.questions)

  constructor() {
  }

  async getQuizzes() {
    const res = await getDocs(this.quizCollection)
    const data = []
    console.log(res.docs)
    for (const doc of res.docs) {
      const queryData = query(this.questionCollection, where('quizId', '==', doc.id));
      const questions = await getDocs(queryData);
      data.push({
        uid: doc.id,
        ...doc.data(),
        questions: questions.docs.length
      })
    }
    return data;
  }

  async addQuiz(data: QuizI) {
    const docRef = await addDoc(this.quizCollection, data);
    return docRef.id;
  }

  async editQuiz(data: QuizI & WithUID) {
    const docRef = doc(this.afs, CollectionNames.quiz, data.uid);
    return setDoc(docRef, {name: data.name})
  }

  deleteQuiz(id: string) {
    const docRef = doc(this.afs, CollectionNames.quiz, id);
    return deleteDoc(docRef)
  }

  async getQuiz(id: string) {
    const docRef = doc(this.afs, CollectionNames.quiz, id);
    return getDoc(docRef);
  }

  getQuestions(quizId: string) {
    return query(this.questionCollection, where('quizId', '==', quizId));
  }

  getNewQuestionId() {
    return doc(this.questionCollection).id;
  }

  async addQuestion(data: QuestionI & WithUID) {
    const docRef = doc(this.questionCollection, data.uid);
    const payload = {...data}
    delete payload.uid;
    return setDoc(docRef, {
      ...data,
    })
  }

}
