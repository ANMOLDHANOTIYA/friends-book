// What are we willing to accept from the client?

import { z } from "zod";

const registerUserSchema = z.strictObject({
    username: z
        .string()
        .trim()
        .min(4, "Username must be at least 3 characters")
        .max(15, "Username cannot exceed 30 characters"),

    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(25, "Password cannot exceed 100 characters"),

    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name cannot exceed 50 characters")
});

const loginUserSchema = z.strictObject({
    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(25, "Password cannot exceed 100 characters")
});

const updateProfileSchema = z.strictObject({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name cannot exceed 50 characters")
        .optional(),

    bio: z
        .string()
        .trim()
        .max(300, "Bio cannot exceed 300 characters")
        .optional()
});

const changeCurrentPasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(1, "Old password is required"),

    newPassword: z
        .string()
        .min(6, "New password must be at least 8 characters")
});

const createPostSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Post content is required")
        .max(5000, "Post content cannot exceed 5000 characters")
});

const createCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment cannot exceed 1000 characters")
});

export {
    registerUserSchema,
    loginUserSchema,
    updateProfileSchema,
    changeCurrentPasswordSchema,
    createPostSchema,
    createCommentSchema
};

    


