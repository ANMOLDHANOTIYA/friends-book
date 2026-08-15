import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

export const Comment = mongoose.model(
    "Comment",
    commentSchema
);