import {Notification}  from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js";

const getNotifications = async (req, res) => {

    const notifications = await Notification
        .find({
            recipient: req.user._id
        })
        .populate(
            "sender",
            "username fullName avatar"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        notifications
    });
};

const markNotificationAsRead = async (req, res) => {

    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: req.user._id
        },
        {
            $set: {
                isRead: true
            }
        },
        {
            new: true
        }
    ).populate(
        "sender",
        "username fullName avatar"
    );

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        notification
    });
};

export {
    getNotifications,
    markNotificationAsRead
};