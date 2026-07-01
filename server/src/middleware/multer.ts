import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    const allowed = ["image/jpg", "image/png", "image/jpeg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG and PNG files are allowed"));
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;
