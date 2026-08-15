import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";

const likePost = async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const existingLike = await Like.findOne({
        user: req.user._id,
        post: postId
    });

    if (existingLike) {
        throw new ApiError(400, "Post already liked");
    }

    const like = await Like.create({
        user: req.user._id,
        post: postId
    });

    return res.status(201).json({
        success: true,
        message: "Post liked successfully",
        like
    });
};

const unlikePost = async (req, res) => {
    const { postId } = req.params;

    const like = await Like.findOne({
        user: req.user._id,
        post: postId
    });

    if (!like) {
        throw new ApiError(404, "Post is not liked");
    }

    await Like.findByIdAndDelete(like._id);

    return res.status(200).json({
        success: true,
        message: "Post unliked successfully"
    });
};

const getPostLikes = async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const likes = await Like.find({
        post: postId
    }).populate(
        "user",
        "username fullName avatar"
    );

    return res.status(200).json({
        success: true,
        message: "Post likes fetched successfully",
        likes,
        count: likes.length
    });
};

export {
    likePost,
    unlikePost,
    getPostLikes
};