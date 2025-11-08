import { Schema, model, Document } from 'mongoose';

interface ITopic {
  title: string;
  key: string;
  order: number;
}

export interface IDomain extends Document {
  slug: string;
  title: string;
  description: string;
  topics: ITopic[];
}

const DomainSchema = new Schema<IDomain>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  topics: [{
    title: { type: String, required: true },
    key: { type: String, required: true },
    order: { type: Number, required: true },
  }],
});

export default model<IDomain>('Domain', DomainSchema);