import mongoose, { Document, Schema, Types } from "mongoose";

export interface IActivityLog extends Document {
    user: Types.ObjectId;
    actionType: "POST_PUBLISHED" | "AI_REPLY";
    description: string;
    relatedPost?: Types.ObjectId;
    platform?: string;
    aiGeneratedText?: string;
    createdAt: Date;
    updatedAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    actionType: {
        type: String,
        enum: ["POST_PUBLISHED", "AI_REPLY"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    platform: {
        type: String,
    },
    aiGeneratedText: {
        type: String
    }
}, {
    timestamps: true,
});

const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);

export default ActivityLog;