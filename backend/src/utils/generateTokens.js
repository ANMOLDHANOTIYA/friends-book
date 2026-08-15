import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessToken = (userId) => {
    return jwt.sign(
        {
            userId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            userId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            jwtid: crypto.randomUUID()
        }
    );
};

export {
    generateAccessToken,
    generateRefreshToken
};