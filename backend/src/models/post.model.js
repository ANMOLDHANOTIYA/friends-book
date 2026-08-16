import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

postSchema.plugin(mongooseAggregatePaginate);

export const Post = mongoose.model("Post", postSchema);