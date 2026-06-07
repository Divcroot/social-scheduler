import { Router } from "express";
import { generateAuthUrl, syncAccounts } from "../controllers/socialAuthController.js";
import { protect } from "../middlewares/auth.middleware.js";


const socialAuthRouter = Router();

socialAuthRouter.get('/:platform/url', protect, generateAuthUrl);
socialAuthRouter.post('/sync', protect, syncAccounts);

export default socialAuthRouter;