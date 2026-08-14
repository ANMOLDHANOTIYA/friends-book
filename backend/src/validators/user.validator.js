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

export {
    registerUserSchema,
    loginUserSchema
};