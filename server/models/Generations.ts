import mongoose, { Document, Schema, Types } from "mongoose";

export interface IGeneration extends Document{
    user: Types.ObjectId;
    prompt: string;
    content: string;
    mediaUrl?: string;
    mediaType?: "image" | "video";
    tone?: string;
    createdAt: Date;
    updatedAt: Date;
}

const generationSchema = new Schema<IGeneration>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    mediaUrl: {
        type: String,
    },
    mediaType: {
        type: String,
        enum: ["image", 'video'],
    },
    tone: {
        type: String,
    },
}, { timestamps: true });

const Generation = mongoose.models.Generation || mongoose.model<IGeneration>("Generation", generationSchema);

export default Generation;