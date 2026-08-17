import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const response = await api.get("/posts/feed", {
        params: {
          page: 1,
          limit: 10,
        },
      });

      setPosts(response.data.posts);
    } catch (error) {
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] p-8 text-white">
        Loading feed...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-xl font-bold tracking-tight">
            Friends
            <span className="text-indigo-500">
              Book
            </span>
          </h1>

          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white">
              🔍
            </button>

            <button className="text-zinc-400 hover:text-white">
              🔔
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 font-semibold">
              A
            </div>
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 py-8">

        {/* Left sidebar */}
        <aside className="col-span-3 hidden lg:block">
          <nav className="sticky top-24 space-y-2">

            {[
              "Home",
              "Explore",
              "Messages",
              "Notifications",
              "Saved",
            ].map((item, index) => (
              <button
                key={item}
                className={`w-full rounded-xl px-4 py-3 text-left transition ${index === 0
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {item}
              </button>
            ))}

          </nav>
        </aside>

        {/* Feed */}
        <section className="col-span-12 lg:col-span-6">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Home
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              See what's happening with your friends.
            </p>
          </div>

          {/* Create post */}
          <CreatePost
            onPostCreated={(newPost) => {
              setPosts((prev) => [
                newPost,
                ...prev,
              ]);
            }}
          />

          {/* Posts */}
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
              />
            ))}
          </div>

        </section>

        {/* Right sidebar */}
        <aside className="col-span-3 hidden xl:block">

          <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

            <h3 className="font-semibold">
              Who to follow
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Discover people you may know.
            </p>

          </div>

        </aside>

      </main>
    </div>
  );
}

export default Feed;