import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { Session } from "../models/session.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {

    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "Username or email already exists"
        );
    }


    const user = await User.create({
        username,
        email,
        password,
        fullName
    });

    const createdUser = await User
        .findById(user._id)
        .select("-password");

    return res.status(201).json({
        message: "User registered successfully",
        user: createdUser
    });
};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    const user = await User
        .findOne({ email })
        .select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    const decodedRefreshToken = jwt.decode(refreshToken);

    const session = await Session.create({
        user: user._id,
        refreshTokenHash,
        tokenId: decodedRefreshToken.jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        message: "User logged in successfully"
    });
};

const getCurrentUser = async (req, res) => {

    const user = await User
        .findById(req.user._id)
        .select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        user
    });
};

const refreshAccessToken = async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(incomingRefreshToken)
        .digest("hex");

    const session = await Session
        .findOne({ refreshTokenHash })
        .select("+refreshTokenHash");

    if (!session) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (session.expiresAt < new Date()) {
        await Session.findByIdAndDelete(session._id);

        throw new ApiError(401, "Refresh token expired");
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
        await Session.findByIdAndDelete(session._id);

        throw new ApiError(401, "Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    const newRefreshTokenHash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    session.expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await session.save();

    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        message: "Access token refreshed successfully"
    });
};

const logoutUser = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        await Session.findOneAndDelete({
            refreshTokenHash
        });
    }

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
};

const updateProfile = async (req, res) => {

    const { fullName, bio } = req.body;

    const updateData = {
        ...(fullName !== undefined && { fullName }),
        ...(bio !== undefined && { bio })
    };

    if (req.file) {

        const avatarLocalPath = req.file.path;

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            throw new ApiError(
                400,
                "Error while uploading avatar"
            );
        }

        updateData.avatar = avatar.url;
    }

    const user = await User
        .findByIdAndUpdate(
            req.user._id,
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        )
        .select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });
};

const changeCurrentPassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(
            400,
            "Old password and new password are required"
        );
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect =
        await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
};

const getUserProfile = async (req, res) => {

    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }

    const user = await User
        .findOne({
            username: username.toLowerCase()
        })
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        user
    });
};

export {
    registerUser,
    loginUser,
    getCurrentUser,
    refreshAccessToken,
    logoutUser,
    updateProfile,
    changeCurrentPassword,
    getUserProfile
};
    