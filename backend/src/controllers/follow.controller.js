import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";
import ApiError from "../utils/ApiError.js";
import {Notification} from "../models/notification.model.js";

const followUser = async (req, res) => {

    const { username } = req.params;

    const userToFollow = await User.findOne({
        username: username.toLowerCase()
    });

    if (!userToFollow) {
        throw new ApiError(404, "User not found");
    }

    // Don't allow following yourself
    if (userToFollow._id.toString() === req.user._id.toString()) {
        throw new ApiError(
            400,
            "You cannot follow yourself"
        );
    }

    // Check whether already following
    const existingFollow = await Follow.findOne({
        follower: req.user._id,
        following: userToFollow._id
    });

    if (existingFollow) {
        throw new ApiError(
            400,
            "You are already following this user"
        );
    }

    const follow = await Follow.create({
        follower: req.user._id,
        following: userToFollow._id
    });

    await Notification.create({
        recipient: targetUser._id,
        sender: req.user._id,
        type: "follow",
        message: `${req.user.username} started following you`
    });

    return res.status(201).json({
        success: true,
        message: "User followed successfully",
        follow
    });
};

const unfollowUser = async (req, res) => {
    const { username } = req.params;

    const targetUser = await User.findOne({ username });

    if (!targetUser) {
        throw new ApiError(404, "User not found");
    }

    const follow = await Follow.findOne({
        follower: req.user._id,
        following: targetUser._id
    });

    if (!follow) {
        throw new ApiError(400, "You are not following this user");
    }

    await Follow.findByIdAndDelete(follow._id);

    return res.status(200).json({
        success: true,
        message: "User unfollowed successfully"
    });
};

const getFollowers = async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const followers = await Follow.find({
        following: user._id
    })
        .populate(
            "follower",
            "username fullName avatar bio"
        );

    return res.status(200).json({
        success: true,
        message: "Followers fetched successfully",
        followers
    });
};

const getFollowing = async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const following = await Follow.find({
        follower: user._id
    }).populate(
        "following",
        "username fullName avatar bio"
    );

    return res.status(200).json({
        success: true,
        message: "Following fetched successfully",
        following
    });
};

export {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
};