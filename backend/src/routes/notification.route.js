import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    getNotifications, markNotificationAsRead
} from "../controllers/notification.controller.js";

const router = Router();

router.get(
    "/",
    verifyJWT,
    asyncHandler(getNotifications)
);

router.patch(
    "/:notificationId/read",
    verifyJWT,
    asyncHandler(markNotificationAsRead)
);

export default router;