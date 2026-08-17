import { Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function CommentItem({ comment, onDelete }) {

    const { user } = useAuth();

    const isOwner =
        user?._id === comment.user?._id;

    return (
        <div className="flex gap-3 py-3">

            <img
                src={comment.user?.avatar || "/avatar.png"}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
            />

            <div className="flex-1 rounded-xl bg-white/[0.04] px-3 py-2">

                <div className="flex items-center justify-between">

                    <p className="text-sm font-medium text-white">
                        {comment.user?.username}
                    </p>

                    {isOwner && (
                        <button
                            onClick={() => onDelete(comment._id)}
                            className="text-zinc-600 transition hover:text-red-400"
                        >
                            <Trash2 size={15} />
                        </button>
                    )}

                </div>

                <p className="mt-1 text-sm text-zinc-400">
                    {comment.content}
                </p>

            </div>

        </div>
    );
}

export default CommentItem;