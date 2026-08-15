import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto"
            }
        );

        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
    console.log("========== CLOUDINARY ERROR ==========");
    console.log(error);
    console.log("message:", error.message);
    console.log("name:", error.name);
    console.log("stack:", error.stack);
    console.log("======================================");

    return null;
}
};

export { uploadOnCloudinary };