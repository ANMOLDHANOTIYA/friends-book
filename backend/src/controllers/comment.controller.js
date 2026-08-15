import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";

const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({
        user: req.user._id,
        post: postId,
        content
    });

    const populatedComment = await Comment
        .findById(comment._id)
        .populate(
            "user",
            "username fullName avatar"
        );

    return res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: populatedComment
    });
};

const getPostComments = async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comments = await Comment
        .find({
            post: postId
        })
        .populate(
            "user",
            "username fullName avatar"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json({
        success: true,
        message: "Comments fetched successfully",
        comments
    });
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Only the comment author can delete it
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete this comment"
        );
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
        success: true,
        message: "Comment deleted successfully"
    });
};

export {
    createComment,
    getPostComments,
    deleteComment
};