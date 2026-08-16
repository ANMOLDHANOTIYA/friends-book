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

const getFeed = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;


    const posts = Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },

        {
            $unwind: "$author"
        },

        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },

        {
            $addFields: {
                likeCount: {
                    $size: "$likes"
                }
            }
        },

        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments"
            }
        },

        {
            $addFields: {
                commentCount: {
                    $size: "$comments"
                }
            }
        },

        {
            $lookup: {
                from: "likes",
                let: {
                    postId: "$_id"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$post", "$$postId"]
                                    },
                                    {
                                        $eq: ["$user", req.user._id]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "currentUserLike"
            }
        },

        {
            $addFields: {
                isLiked: {
                    $gt: [
                        { $size: "$currentUserLike" },
                        0
                    ]
                }
            }
        },

        {
            $project: {
                content: 1,
                image: 1,
                createdAt: 1,
                author: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1
                },
                likeCount: 1,
                commentCount: 1,
                isLiked: 1
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    const result = await Post.aggregatePaginate(
        posts,
        {
            page,
            limit
        }
    );

    return res.status(200).json({
        success: true,
        message: "Feed fetched successfully",
        posts: result.docs,
        pagination: {
            totalDocs: result.totalDocs,
            limit: result.limit,
            page: result.page,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage
        }
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
    deletePost,
    getFeed
};