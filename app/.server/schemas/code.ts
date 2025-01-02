import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICode extends Document {
  userId: string;
  code: {
    html: string;
    css: string;
    js: string;
  };
}

const codeSchema = new Schema<ICode>(
    {
      userId: { type: String, required: true, unique: true },
      code: {
        html: { 
          type: String, 
          default: "<!-- Write your HTML code here! -->", 
          set: (value: string) => (value?.trim() === "" ? undefined : value) 
        },
        css: { 
          type: String, 
          default: "// Write your CSS code here", 
          set: (value: string) => (value?.trim() === "" ? undefined : value) 
        },
        js: { 
          type: String, 
          default: "// Write your JavaScript code here", 
          set: (value: string) => (value?.trim() === "" ? undefined : value) 
        },
      },
    },
    { timestamps: true }
  );
  

export const Code: Model<ICode> =
  mongoose.models.Code || mongoose.model<ICode>('Code', codeSchema);

export type CodeType = mongoose.InferSchemaType<typeof codeSchema>;
