import { User } from "../models/user.model.js";

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
        return res.status(409).json({
            message: "User already exists"
        });
    }

    const user = await User.create({
        username,
        email,
        password,
        fullName
    });

    return res.status(201).json({
        message: "User registered successfully",
        user
    });
};

export {
    registerUser
};