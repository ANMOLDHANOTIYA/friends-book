import { useEffect, useState } from "react";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import PostCard from "../components/post/PostCard";
import EditProfile from "../components/profile/EditProfile";

function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const fetchProfile = async () => {
        try {
            const userResponse = await api.get(
                `/users/${username}`
            );

            const postsResponse = await api.get(
                `/posts/user/${username}`
            );

            const followersResponse = await api.get(
                `/follows/${username}/followers`
            );

            const followingResponse = await api.get(
                `/follows/${username}/following`
            );

            setUser(userResponse.data.user);

            setPosts(
                postsResponse.data.posts || []
            );

            setFollowers(
                followersResponse.data.followers || []
            );

            setFollowing(
                followingResponse.data.following || []
            );

        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [username]);

    /*
     * Backend returns:
     *
     * follower: {
     *   follower: {
     *      username: "..."
     *   }
     * }
     */
    const isFollowing = followers.some(
        (item) =>
            item.follower?.username === username
    );

    const handleFollow = async () => {
        try {
            setFollowLoading(true);

            if (isFollowing) {

                await api.delete(
                    `/follows/${username}`
                );

                setFollowers((prev) =>
                    prev.filter(
                        (item) =>
                            item.follower?.username !==
                            username
                    )
                );

            } else {

                await api.post(
                    `/follows/${username}`
                );

                /*
                 * Fetch updated followers
                 */
                const response = await api.get(
                    `/follows/${username}/followers`
                );

                setFollowers(
                    response.data.followers || []
                );
            }

        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-zinc-400">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#09090b] p-8 text-white">
                User not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white">

            <div className="mx-auto max-w-3xl px-6 py-8">

                {/* Back */}
                <button
                    onClick={() => navigate("/feed")}
                    className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                {/* Profile card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                        {/* User info */}
                        <div className="flex items-center gap-5">

                            <img
                                src={
                                    user.avatar ||
                                    "/avatar.png"
                                }
                                alt={user.username}
                                className="h-24 w-24 shrink-0 rounded-full border border-white/10 object-cover"
                            />

                            <div>

                                <h1 className="text-2xl font-bold">
                                    {user.fullName}
                                </h1>

                                <p className="text-zinc-500">
                                    @{user.username}
                                </p>

                                {user.bio && (
                                    <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
                                        {user.bio}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* Follow button */}
                        <div className="shrink-0">

                            <button
                                onClick={handleFollow}
                                disabled={followLoading}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    isFollowing
                                        ? "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                                        : "bg-indigo-500 text-white hover:bg-indigo-400"
                                }`}
                            >

                                {isFollowing ? (
                                    <>
                                        <UserMinus size={16} />
                                        Following
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={16} />
                                        Follow
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                    {/* Stats */}
                    <div className="mt-6 flex gap-8 border-t border-white/5 pt-5">

                        <div>
                            <p className="text-lg font-semibold">
                                {posts.length}
                            </p>

                            <p className="text-xs text-zinc-500">
                                Posts
                            </p>
                        </div>

                        <div>
                            <p className="text-lg font-semibold">
                                {followers.length}
                            </p>

                            <p className="text-xs text-zinc-500">
                                Followers
                            </p>
                        </div>

                        <div>
                            <p className="text-lg font-semibold">
                                {following.length}
                            </p>

                            <p className="text-xs text-zinc-500">
                                Following
                            </p>
                        </div>

                    </div>

                </div>

                {/* Posts */}
                <div className="mt-8">

                    <h2 className="mb-5 text-xl font-semibold">
                        Posts
                    </h2>

                    {posts.length === 0 ? (

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">

                            <p className="font-medium">
                                No posts yet
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                This user hasn't posted anything.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-5">

                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                />
                            ))}

                        </div>

                    )}

                </div>

            </div>

            {/* Edit Profile */}
            {editOpen && (
                <EditProfile
                    user={user}
                    onUpdated={(updatedUser) => {
                        setUser(updatedUser);
                    }}
                    onClose={() => {
                        setEditOpen(false);
                    }}
                />
            )}

        </div>
    );
}

export default Profile;