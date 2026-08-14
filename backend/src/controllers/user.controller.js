import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";

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

    return res.status(200).json({
        success: true,
        message: "User logged in successfully"
    });
};

export {
    registerUser,
    loginUser
};