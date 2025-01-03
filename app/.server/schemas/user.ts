import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for User
export interface IUser extends Document {
    email: string;
    password: string;
    username?: string;
    name?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Schema for User
const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            trim: true,
            default: null,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            trim: true,
            default: null
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        image: {
            type: String, // URL or file path
            default: null,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
        versionKey: false, // Removes the __v field
    }
);

// Adding an index for faster query based on email
// userSchema.index({ email: 1 });

// Mongoose Model for User
export const User : Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export type UserType = mongoose.InferSchemaType<typeof userSchema>;