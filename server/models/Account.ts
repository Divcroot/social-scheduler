import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

export enum Platform {
    INSTAGRAM = "instagram",
    LINKEDIN = "linkedin",
    TWITTER = "twitter",
    FACEBOOK = "facebook",
    FACEBOOK_PAGE = "facebook_page",
    LINKDIN_PAGE = "linkedin_page",
    INSTAGRAM_BUSINESS = "instagram_business"
}

export interface IAccount extends Document {
    user: mongoose.Types.ObjectId;
    zernioAccountId: string;
    handle: string;
    avatarUrl?: string;
    platform: Platform;
    status: "connected" | 'disconnected';
    accessToken: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;

}

const accountSchema = new Schema<IAccount>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    platform: {
        type: String,
        required: true,
        enum: ["instagram", "linkedin", "twitter", "facebook", "facebook_page", "linkedin_page", "instagram_business"],
    },
    handle: {
        type: String,
        required: true,
        trim: true,
    },
    zernioAccountId: {
        type: String,
        required: true,
        unique: true,
    },
    accessToken: {
        type: String,
        select: false,
    },
    refreshToken: {
        type: String,
        select: false,
    },
    tokenExpiresAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["connected", "disconnected"],
        default: "connected"
    },
    avatarUrl: {
        type: String,
        default: null,
    },
}, { timestamps: true })

const Account = mongoose.models.Account || mongoose.model<IAccount>("Account", accountSchema);

export default Account;