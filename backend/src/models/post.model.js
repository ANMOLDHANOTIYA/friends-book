import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: String,
            trim: true,
            maxlength: 5000
        },

        image: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export const Post = mongoose.model("Post", postSchema);