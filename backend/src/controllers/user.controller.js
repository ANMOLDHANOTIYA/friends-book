import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const registerUser = async (req, res) => {

    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
        return res.status(400).json({
            message: "All fields are required"
        });
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

export {
    registerUser
};