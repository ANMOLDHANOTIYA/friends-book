import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Access token is required");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User
            .findById(decodedToken.userId)
            .select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
};

export default verifyJWT;