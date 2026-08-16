import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createPost, getAllPosts, getUserPosts, updatePost, deletePost, getFeed } from "../controllers/post.controller.js";
import { createPostSchema } from "../validators/user.validator.js";

const router = Router();

router.post("/", verifyJWT, validate(createPostSchema), asyncHandler(createPost));

router.get("/", verifyJWT, asyncHandler(getAllPosts));
router.get("/feed", verifyJWT, asyncHandler(getFeed));

router.get("/user/:username", verifyJWT, asyncHandler(getUserPosts));

router.patch("/user/:postId", verifyJWT, validate(createPostSchema), asyncHandler(updatePost));

router.delete("/user/:postId", verifyJWT, asyncHandler(deletePost));

export default router;