import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { likePost, unlikePost, getPostLikes } from "../controllers/like.controller.js";

const router = Router();

router.post("/:postId", verifyJWT, asyncHandler(likePost));
router.delete("/:postId", verifyJWT, asyncHandler(unlikePost));
router.get("/:postId", verifyJWT, asyncHandler(getPostLikes));

export default router;