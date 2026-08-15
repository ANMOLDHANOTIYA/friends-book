import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

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

    return res.status(200).json({
        success: true,
        user: req.user
    });
};

export {
    registerUser,
    loginUser, 
    getCurrentUser
};