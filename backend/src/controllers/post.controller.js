import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";

const createPost = async (req, res) => {

    const { content } = req.body;

    const post = await Post.create({
        author: req.user._id,
        content
    });

    const populatedPost = await Post
        .findById(post._id)
        .populate(
            "author",
            "username fullName avatar"
        );

    return res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: populatedPost
    });
};

const getAllPosts = async (req, res) => {

    const posts = await Post
        .find()
        .populate("author", "username fullName avatar")
        .sort({ createdAt: -1 })
        .lean();

    const postIds = posts.map(post => post._id);

    const likes = await Like.find({
        post: { $in: postIds }
    }).lean();

    const likedPostIds = new Set(
        likes
            .filter(
                like =>
                    like.user.toString() ===
                    req.user._id.toString()
            )
            .map(like => like.post.toString())
    );

    const postsWithLikes = posts.map(post => {

        const likeCount = likes.filter(
            like =>
                like.post.toString() ===
                post._id.toString()
        ).length;

        return {
            ...post,
            likeCount,
            isLiked: likedPostIds.has(
                post._id.toString()
            )
        };
    });

    return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        posts: postsWithLikes
    });
};

const getUserPosts = async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({
        username: username.toLowerCase()
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const posts = await Post
        .find({
            author: user._id
        })
        .populate(
            "author",
            "username fullName avatar"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json({
        success: true,
        message: "User posts fetched successfully",
        posts
    });
};

const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Only the author can update the post
    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to update this post"
        );
    }

    post.content = content;

    await post.save();

    const updatedPost = await Post
        .findById(post._id)
        .populate(
            "author",
            "username fullName avatar"
        );

    return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        post: updatedPost
    });
};

const deletePost = async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Only the author can delete the post
    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete this post"
        );
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
        success: true,
        message: "Post deleted successfully"
    });
};

export {
    createPost,
    getAllPosts,
    getUserPosts,
    updatePost,
    deletePost
};