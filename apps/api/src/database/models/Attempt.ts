import { Schema, model, Document, Types } from 'mongoose';

export interface IAttempt extends Document {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  score: number;
  perTopic: Record<string, number>;
}

const AttemptSchema = new Schema<IAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  perTopic: { type: Map, of: Number, required: true },
}, { timestamps: true });

export default model<IAttempt>('Attempt', AttemptSchema);