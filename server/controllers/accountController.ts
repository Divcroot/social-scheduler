import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Account from "../models/Account.js";
import zernio from "../config/zernio.js";

//Get all Accounts
export const getAccounts = async (req: AuthRequest, res: Response) : Promise<void> => {
    try {
        const accounts = await Account.find({user: req.user._id});
        res.status(200).json(accounts);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error'});
    }
}

//Add a Account
export const addAccount = async (req: AuthRequest, res: Response) : Promise<void> => {
    try {
        const { platform, handle, avatarUrl } = req.body;
        const account = await Account.create({user: req.user._id, platform, handle, avatarUrl});
        res.status(201).json(account);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error'});
    }
}

//Disconnect Account
export const disconnectAccount = async (req: AuthRequest, res: Response) : Promise<void> => {
    try {
        const account = await Account.findOne({_id: req.params.id, user: req.user._id});

        if(!account){
            res.status(404).json({success: false, message: "Account not found"});
            return;
        }

        if(account.zernioAccountId){
            try {
                await zernio.accounts.deleteAccount({path: {accountId: account.zernioAccountId}});
            } catch (error: any) {
                res.status(500).json({message: error?.response?.data?.message || error?.message});
                return;
            }
        }
        await account.deleteOne();
        res.status(200).json({success: true, message: "Account disconnected successfully "})
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error'});
    }
}


