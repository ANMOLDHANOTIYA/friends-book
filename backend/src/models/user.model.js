import moongoose from 'mongoose';

const userSchema = new moongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    coverimage: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500,
        default: '',
    }
}, { timestamps: true }
);

export const User = moongoose.model('User', userSchema);