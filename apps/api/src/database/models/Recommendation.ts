import { Schema, model, Document, Types } from 'mongoose';

interface IRecommendationItem {
  type: 'topic' | 'quiz';
  refId: string;
  reason: string;
}

export interface IRecommendation extends Document {
  userId: Types.ObjectId;
  items: IRecommendationItem[];
}

const RecommendationSchema = new Schema<IRecommendation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    type: { type: String, enum: ['topic', 'quiz'], required: true },
    refId: { type: String, required: true },
    reason: { type: String, required: true },
  }],
}, { timestamps: true });

export default model<IRecommendation>('Recommendation', RecommendationSchema);