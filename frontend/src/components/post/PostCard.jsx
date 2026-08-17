import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import api from "../../services/api";

function PostCard({ post }) {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    const handleLike = async () => {
        try {
            if (isLiked) {
                await api.delete(`/likes/${post._id}`);
                setIsLiked(false);
                setLikeCount((prev) => prev - 1);
            } else {
                await api.post(`/likes/${post._id}`);
                setIsLiked(true);
                setLikeCount((prev) => prev + 1);
            }
        } catch (error) {
            console.error(error.response?.data || error);
        }
    };

    return (
        <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05]">

            <div className="flex items-center justify-between px-5 pt-5">
                <div className="flex items-center gap-3">
                    <img
                        src={post.author.avatar || "/avatar.png"}
                        alt={post.author.username}
                        className="h-11 w-11 rounded-full border border-white/10 object-cover"
                    />

                    <div>
                        <p className="font-semibold">
                            {post.author.fullName}
                        </p>

                        <p className="text-sm text-zinc-500">
                            @{post.author.username}
                        </p>
                    </div>
                </div>

                <button className="text-zinc-500 hover:text-white">
                    •••
                </button>
            </div>

            <div className="px-5 py-5">
                <p className="leading-7 text-zinc-200">
                    {post.content}
                </p>
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 px-5 py-3">

                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                        isLiked
                            ? "text-rose-500"
                            : "text-zinc-500 hover:bg-white/5 hover:text-rose-400"
                    }`}
                >
                    <Heart
                        size={18}
                        fill={isLiked ? "currentColor" : "none"}
                    />

                    {likeCount}
                </button>

                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-white/5 hover:text-indigo-400">
                    <MessageCircle size={18} />
                    {post.commentCount}
                </button>

            </div>
        </article>
    );
}

export default PostCard;