import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/follow.controller.js";

const router = Router();

router.post( "/:username", verifyJWT, asyncHandler(followUser) );
router.delete( "/:username", verifyJWT,  asyncHandler(unfollowUser) );
router.get( "/:username/followers", verifyJWT, asyncHandler(getFollowers) );
router.get( "/:username/following", verifyJWT, asyncHandler(getFollowing) );

export default router;