import { Request, Response } from "express";
import getOrCreateZernioProfile from "../utils/zernioProfileHelperFn.js";
import zernio from "../config/zernio.js";
import Account from "../models/Account.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";


export const generateAuthUrl = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { platform } = req.params;
        const profileId = await getOrCreateZernioProfile(req.user);

        const origin = req.headers.origin;
        if(!origin){
            throw new Error("Missing origin header")
        }
        const redirectUrl = `${origin}/accounts`;

        const result = await zernio.connect.getConnectUrl({
            path: { platform: platform as any },
            query: {
                profileId,
                redirectUrl: redirectUrl
            }
        })

        const data = result.data as any;
        console.log("getConnectUrl response: ", JSON.stringify(data, null, 2));

        const authUrl = data.authUrl;
        if (!authUrl) {
            throw new Error(`Zernio returned no authUrl. Full response: ${JSON.stringify(data)}`);
        }

        res.status(200).json({ success: true, url: authUrl });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server error" })
    }
}

export const syncAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const profileId = await getOrCreateZernioProfile(req.user);
        const result = await zernio.accounts.listAccounts({
            query: { profileId } as any
        })

        const data = result.data as any;
        const zenrioAccounts: any[] = data?.accounts || (Array.isArray(data) ? data : []);
        const supportedPlatforms = ['twitter', 'linkedin', 'facebook', 'instagram'];
        const syncedAccounts = [];

        for (const zAccount of zenrioAccounts) {
            const zid = zAccount._id || zAccount.id;
            if (!zid) {
                console.warn("Skipping account with no ID: ", zAccount);
                continue;
            }

            const rawPlatform = (zAccount.platform || zAccount.type || "").toLowerCase();
            const normalizedPlatform = supportedPlatforms.find((p) => rawPlatform.includes(p));

            if (!normalizedPlatform) {
                console.log(`Skipping unsupported platform: "${rawPlatform}"`);
                continue;
            }

            const account = await Account.findOneAndUpdate({ zernioAccountId: zid }, {
                user: req.user._id,
                platform: normalizedPlatform,
                handle: zAccount.username || zAccount.name || zAccount.handle || 'Unknown',
                zernioAccountId: zid,
                status: "connected",
                avatarUrl: zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url,
            },
                {
                    upsert: true,
                    returnDocument: 'after'
                });

            syncedAccounts.push(account);
        }

        res.status(200).json({ success: true, accounts: syncedAccounts });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error' })
    }
}