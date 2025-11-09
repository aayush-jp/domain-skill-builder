import { Schema, model, Document } from 'mongoose';

interface IQuestion {
  qid: string;
  stem: string;
  options: string[];
  answerIndex: number;
   topicKey: string;
}

export interface IQuiz extends Document {
  domainSlug: string;
  title: string;
  questions: IQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizSchema = new Schema<IQuiz>({
  domainSlug: { type: String, required: true, index: true },
  title: { type: String, required: true },
  questions: [{
    qid: { type: String, required: true },
    stem: { type: String, required: true },
    options: [{ type: String, required: true }],
    answerIndex: { type: Number, required: true },
    topicKey: { type: String, required: true },
  }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
});

export default model<IQuiz>('Quiz', QuizSchema);