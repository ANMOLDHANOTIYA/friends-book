import { useEffect, useState } from "react";
import { Search, Bell, X } from "lucide-react";
import api from "../services/api";
import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  // Search users
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setSearchLoading(true);

        const response = await api.get("/users/search", {
          params: {
            query: searchQuery,
          },
        });

        setUsers(response.data.users || []);
      } catch (error) {
        console.error(error.response?.data || error);
        setUsers([]);
      } finally {
        setSearchLoading(false);
      }
    };

    // Small debounce so we don't call API on every keystroke
    const timer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setUsers([]);
  };

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

          {/* Logo */}
          <h1 className="text-xl font-bold tracking-tight">
            Friends
            <span className="text-indigo-500">
              Book
            </span>
          </h1>

          {/* Navbar actions */}
          <div className="relative flex items-center gap-3">

            {/* Search */}
            {searchOpen ? (
              <div className="relative flex items-center">

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2">

                  <Search
                    size={18}
                    className="mr-2 text-zinc-500"
                  />

                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Search people..."
                    className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                  />

                  <button
                    onClick={closeSearch}
                    className="ml-2 text-zinc-500 transition hover:text-white"
                  >
                    <X size={17} />
                  </button>

                </div>

                {/* Search results */}
                {(searchQuery.trim() || searchLoading) && (
                  <div className="absolute right-0 top-14 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] shadow-2xl shadow-black/40">

                    {searchLoading && (
                      <div className="px-4 py-4 text-sm text-zinc-500">
                        Searching...
                      </div>
                    )}

                    {!searchLoading &&
                      searchQuery.trim() &&
                      users.length === 0 && (
                        <div className="px-4 py-5 text-center text-sm text-zinc-500">
                          No users found
                        </div>
                      )}

                    {!searchLoading && users.length > 0 && (
                      <div className="py-2">

                        {users.map((user) => (
                          <button
                            key={user._id}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                          >
                            <img
                              src={
                                user.avatar ||
                                "/avatar.png"
                              }
                              alt={user.username}
                              className="h-10 w-10 rounded-full border border-white/10 object-cover"
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {user.fullName}
                              </p>

                              <p className="truncate text-xs text-zinc-500">
                                @{user.username}
                              </p>
                            </div>
                          </button>
                        ))}

                      </div>
                    )}

                  </div>
                )}

              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <Search size={20} />
              </button>
            )}

            {/* Notifications */}
            <button
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Bell size={20} />
            </button>

            {/* Avatar */}
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
                className={`w-full rounded-xl px-4 py-3 text-left transition ${
                  index === 0
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

          {/* Heading */}
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
          <div className="mt-6 space-y-5">
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