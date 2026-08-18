import { useEffect, useState } from "react";
import { Bell, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Notifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");

            setNotifications(
                response.data.notifications || []
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
        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const response = await api.patch(
                `/notifications/${notificationId}/read`
            );

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === notificationId
                        ? response.data.notification
                        : notification
                )
            );
        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-zinc-400">
                Loading notifications...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white">

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-2xl items-center gap-4 px-6 py-4">

                    <button
                        onClick={() => navigate("/feed")}
                        className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <h1 className="text-lg font-bold">
                            Notifications
                        </h1>

                        {unreadCount > 0 && (
                            <p className="text-xs text-indigo-400">
                                {unreadCount} unread
                            </p>
                        )}
                    </div>

                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-2xl px-6 py-8">

                {/* Page heading */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                            <Bell size={22} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold">
                                Activity
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Stay updated with what's happening.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Notifications */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

                    {notifications.length === 0 ? (

                        <div className="flex flex-col items-center px-6 py-20 text-center">

                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                                <Bell
                                    size={28}
                                    className="text-zinc-600"
                                />
                            </div>

                            <p className="mt-5 font-semibold">
                                You're all caught up
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                No new notifications right now.
                            </p>

                        </div>

                    ) : (

                        notifications.map((notification) => (

                            <div
                                key={notification._id}
                                className={`group flex items-start gap-4 border-b border-white/5 px-5 py-5 transition last:border-0 ${
                                    !notification.isRead
                                        ? "bg-indigo-500/[0.06]"
                                        : "hover:bg-white/[0.025]"
                                }`}
                            >

                                {/* Avatar */}
                                <img
                                    src={
                                        notification.sender?.avatar ||
                                        "/avatar.png"
                                    }
                                    alt=""
                                    className="h-11 w-11 shrink-0 rounded-full border border-white/10 object-cover"
                                />

                                {/* Content */}
                                <div className="min-w-0 flex-1">

                                    <p className="text-sm leading-6 text-zinc-300">
                                        <span className="font-semibold text-white">
                                            {notification.sender?.username}
                                        </span>{" "}
                                        {notification.message}
                                    </p>

                                    {!notification.isRead && (
                                        <button
                                            onClick={() =>
                                                markAsRead(
                                                    notification._id
                                                )
                                            }
                                            className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-indigo-400 transition hover:bg-indigo-500/10 hover:text-indigo-300"
                                        >
                                            <Check size={13} />
                                            Mark as read
                                        </button>
                                    )}

                                </div>

                                {/* Unread indicator */}
                                {!notification.isRead && (
                                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30" />
                                )}

                            </div>

                        ))

                    )}

                </div>

            </main>
        </div>
    );
}

export default Notifications;