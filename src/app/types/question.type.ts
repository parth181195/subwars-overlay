export type QuestionI = {
  active: boolean;
  questionText: string;
  answer?: string;
  questionMedia?: string;
  answerMedia?: string;
  quizId?: string;
  questionType: QUESTION_TYPES;
}
export enum QUESTION_TYPES {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
}
