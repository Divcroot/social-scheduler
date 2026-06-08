import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
    user: Types.ObjectId;
    prompt: string;
    mediaUrl?: string;
    mediaType?: "image" | "video";
    platforms: ("twitter" | "linkedin" | "instagram" | 'facebook' | 'facebook_page' | 'instagram_business' | 'linkedin_page')[];
    scheduledFor: Date;
    status: "draft" | "scheduled" | "published" | "failed";
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    prompt: {
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
    platforms: [
        {
            type: String,
            enum: ["twitter", "linkedin", "instagram", 'facebook', 'facebook_page', 'instagram_business', 'linkedin_page'],
        },
    ],
    scheduledFor: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "scheduled", "published", "failed"],
        default: "scheduled",
    },
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;