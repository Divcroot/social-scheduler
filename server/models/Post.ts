import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
    user: Types.ObjectId;
    content: string;
    prompt?: string;
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
    content: {
        type: String,
        required: true,
    },
    prompt: {
        type: String,
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
    status: {
        type: String,
        enum: ["draft", "scheduled", "published", "failed"],
        default: "scheduled",
    },
    scheduledFor: {
        type: Date,
        required: true,
        validate: {
            validator: function (this: any, value: Date) {
                // Only require a future scheduled date when the post is still scheduled.
                if (this.status !== 'scheduled') {
                    return true;
                }
                return value > new Date();
            },
            message: 'scheduleFor must be a future date'
        }
    },
}, {
    timestamps: true,
}).pre('save', function () {
    if (!this.platforms?.length) {
        throw new Error('At least one platform must be specified');
    }
});

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;