import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { pollLeonardoJob } from "../utils/leonardoAiHelperFn.js";
import { cloudinary } from "../config/cloudinary.js";
import Generation from "../models/Generations.js";
import Post from "../models/Post.js";


//Generate Post
export const generatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { prompt, tone, generateImage } = req.body;

        if (!prompt?.trim()) {
            res.status(400).json({ success: false, message: "Prompt is required" });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            res.status(500).json({ success: false, message: "Google Gemini API Key is missing, Please add it in your .env file." })
            return;
        }

        //Gemini for text generation
        const ai = new GoogleGenAI({ apiKey });

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a social media post based on this prompt: "${prompt}" and tone: "${tone}".
            Include relevant hashtags too.
            Format the response as JSON with "content" and "imagePrompt" fields.
            The "imagePrompt" should be highly descriptive prompt for an image generator that complements the post.`,
        });

        let content = "";
        let imagePrompt = prompt;

        try {
            const rawText = textResponse.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawText, imagePrompt: prompt };
            content = data.content;
            imagePrompt = data.imagePrompt;
        } catch (e) {
            content = textResponse.text || "";
        }

        let mediaUrl = "";
        if (generateImage) {
            try {
                //Leonardo Ai for image generation
                const leonardoKey = process.env.LEONARDO_API_KEY;

                if (leonardoKey) {
                    try {
                        const payload = {
                            "public": false,
                            "model": "gpt-image-2",
                            "parameters": {
                                "quality": "HIGH",
                                "prompt": imagePrompt,
                                "quantity": 1,
                                "width": 1024,
                                "height": 1024,
                                "prompt_enchance": "ON"
                            }
                        };

                        const leoResponse = await axios.post("https://cloud.leonardo.ai/api/rest/v1/generations", payload, {
                            headers: {
                                accept: "application/json",
                                authorization: `Bearer ${leonardoKey}`,
                                "content-type": "application/json"
                            },
                        })

                        const generationId = leoResponse.data.generate.generationId;
                        if (!generationId) {
                            console.log("Full response received:", leoResponse.data);
                            throw new Error("No generation ID received from Leonardo.ai. Full response: " + JSON.stringify(leoResponse.data));
                        }

                        const tempUrl = await pollLeonardoJob(generationId, leonardoKey);

                        //Cloudinary upload
                        const uploadResult = await cloudinary.uploader.upload(tempUrl, {
                            folder: "ai-generations"
                        })

                        mediaUrl = uploadResult.secure_url;
                    } catch (leoError: any) {
                        console.error("Leonardo API Error Details:", {
                            status: leoError.response?.status,
                            error: leoError.response?.data,
                            message: leoError.message,
                        });
                        // Continue without image - don't throw
                    }
                }
            } catch (error: any) {
                console.error("Image generation failed: ", error.response?.data || error.message);
            }
        }

        //Save generation to DB
        const generation = await Generation.create({
            user: req.user._id,
            prompt,
            content,
            mediaUrl,
            mediaType: mediaUrl ? "image" : undefined,
            tone
        })

        res.status(201).json(generation);

    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error' });
    }
}

//Get Generations
export const getGenerations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const generations = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(generations);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error' });
    }
}

//Get Posts
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({ user: req.user._id });
        res.status(200).json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error' });
    }
}

//Schedule Post
export const schedulePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, platforms, scheduledFor, status } = req.body;

         if (!content?.trim()) {
            res.status(400).json({ message: "Content is required" });
            return;
         }

          if (!platforms) {
             res.status(400).json({ message: "Platforms are required" });
             return;
          }

          if (!scheduledFor) {
             res.status(400).json({ message: "Scheduled time is required" });
             return ;
          }

        //Parse platforms if it comes as a stringified array from formdata
        let parsedPlatforms = platforms;
        if (typeof platforms === 'string') {
            try {
                parsedPlatforms = JSON.parse(platforms);
            } catch (error) {
                parsedPlatforms = platforms.split(",");
            }
        }

        let mediaUrl: string | undefined = req.body.mediaUrl;
        let mediaType: "image" | "video" = req.body.mediaType;

        if (req.file) {
            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: "auto", folder: 'social-scheduler' }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                stream.end(req.file!.buffer);
            });

            mediaUrl = result.secure_url;
            if (result.resource_type === 'video') {
                 mediaType = 'video';
            } else if (result.resource_type === 'image') {
                mediaType = 'image';
            } else {
                throw new Error(`Unsupported file type: ${result.resource_type}`);
            }
        }

        const post = await Post.create({
            user: req.user._id,
            content,
            platforms: parsedPlatforms,
            mediaUrl,
            mediaType,
            scheduledFor,
            status
        });

        res.status(201).json(post);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error' });
    }
}