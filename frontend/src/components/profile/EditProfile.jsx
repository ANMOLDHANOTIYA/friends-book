import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import api from "../../services/api";

function EditProfile({ user, onUpdated, onClose }) {

    const [fullName, setFullName] = useState(
        user.fullName || ""
    );

    const [bio, setBio] = useState(
        user.bio || ""
    );

    const [avatar, setAvatar] = useState(null);

    const [preview, setPreview] = useState(
        user.avatar || "/avatar.png"
    );

    const [loading, setLoading] = useState(false);

    // Clean up preview URL
    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleAvatarChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5MB.");
            return;
        }

        setAvatar(file);

        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "fullName",
                fullName
            );

            formData.append(
                "bio",
                bio
            );

            if (avatar) {
                formData.append(
                    "avatar",
                    avatar
                );
            }

            const response = await api.patch(
                "/users/profile",
                formData
            );

            onUpdated(response.data.user);

            onClose();

        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121216] p-6 shadow-2xl">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Edit Profile
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Update your profile information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-500 transition hover:text-white"
                    >
                        <X size={20} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Avatar */}
                    <div className="flex justify-center">

                        <label className="group relative cursor-pointer">

                            <img
                                src={preview}
                                alt="Profile"
                                className="h-24 w-24 rounded-full border-2 border-white/10 object-cover"
                            />

                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition group-hover:opacity-100">

                                <Camera
                                    size={22}
                                    className="text-white"
                                />

                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />

                        </label>

                    </div>

                    {/* Full name */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Full name
                        </label>

                        <input
                            value={fullName}
                            onChange={(e) =>
                                setFullName(
                                    e.target.value
                                )
                            }
                            maxLength={50}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                        />

                    </div>

                    {/* Bio */}
                    <div>

                        <div className="mb-2 flex justify-between">

                            <label className="text-sm font-medium text-zinc-300">
                                Bio
                            </label>

                            <span className="text-xs text-zinc-600">
                                {bio.length}/300
                            </span>

                        </div>

                        <textarea
                            value={bio}
                            onChange={(e) =>
                                setBio(
                                    e.target.value
                                )
                            }
                            maxLength={300}
                            rows={4}
                            placeholder="Tell people about yourself..."
                            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-500"
                        />

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : "Save changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditProfile;