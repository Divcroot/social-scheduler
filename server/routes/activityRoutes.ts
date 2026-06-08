import { Router } from "express";
import { getActivity } from "../controllers/activityController.js";
import { protect } from "../middlewares/auth.middleware.js";


const activityRouter = Router();

activityRouter.get('/', protect, getActivity);

export default activityRouter;