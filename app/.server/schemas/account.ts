import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAccount extends Document {
  password: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    password: { type: String, required: true },
    username: { type: String, trim: true, required: true, unique: true }, // Already handled
  },
  { timestamps: true }
);

// Create or retrieve the Account model
export const Account: Model<IAccount> =
  mongoose.models.Account || mongoose.model<IAccount>('Account', accountSchema);

  export type AccountType = mongoose.InferSchemaType<typeof accountSchema>;