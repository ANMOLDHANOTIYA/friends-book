import { useState } from "react";
import api from "../../services/api";

function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setLoading(true);

            const response = await api.post("/posts", {
                content: content.trim(),
            });

            onPostCreated(response.data.post);
            setContent("");
        } catch (error) {
            console.error(error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                maxLength={5000}
                className="w-full resize-none bg-transparent text-white outline-none placeholder:text-zinc-500"
            />

            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-xs text-zinc-500">
                    {content.length}/5000
                </span>

                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-semibold transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>
        </form>
    );
}

export default CreatePost;