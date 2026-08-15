import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    createComment, getPostComments, deleteComment
} from "../controllers/comment.controller.js";

import {
    createCommentSchema
} from "../validators/user.validator.js";

const router = Router();

router.post(
    "/:postId",
    verifyJWT,
    validate(createCommentSchema),
    asyncHandler(createComment)
);

router.get(
    "/:postId",
    verifyJWT,
    asyncHandler(getPostComments)
);

router.delete(
    "/:commentId",
    verifyJWT,
    asyncHandler(deleteComment)
);

export default router;