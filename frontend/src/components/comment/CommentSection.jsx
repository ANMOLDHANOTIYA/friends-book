import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import api from "../../services/api";
import CommentItem from "./CommentItem";

function CommentSection({ postId }) {

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const response = await api.get(
                `/comments/${postId}`
            );

            setComments(response.data.comments);

        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setLoading(true);

            const response = await api.post(
                `/comments/${postId}`,
                {
                    content: content.trim()
                }
            );

            setComments((prev) => [
                response.data.comment,
                ...prev
            ]);

            setContent("");

        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await api.delete(
                `/comments/${commentId}`
            );

            setComments((prev) =>
                prev.filter(
                    (comment) =>
                        comment._id !== commentId
                )
            );

        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="border-t border-white/5 px-5 py-4">

            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
            >
                <input
                    value={content}
                    onChange={(e) =>
                        setContent(e.target.value)
                    }
                    placeholder="Write a comment..."
                    className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-indigo-500"
                />

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !content.trim()
                    }
                    className="rounded-xl bg-indigo-500 p-2.5 text-white transition hover:bg-indigo-400 disabled:opacity-40"
                >
                    <Send size={17} />
                </button>
            </form>

            <div className="mt-3">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

        </div>
    );
}

export default CommentSection;