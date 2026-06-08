import { Router } from "express";
import { generatePost, getGenerations, getPosts, schedulePost } from "../controllers/postController.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";


const postRouter = Router();

postRouter.get('/', protect, getPosts);
postRouter.post('/', protect, upload.single('media'), schedulePost);
postRouter.get('/generations', protect, getGenerations);
postRouter.post('/generate', protect, generatePost);

export default postRouter;