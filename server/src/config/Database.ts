import mongoose from "mongoose";

export default function connectMongoDB() {
    mongoose.connect("mongodb://127.0.0.1:27017/aes");
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB Connection Error: "));
    db.once("open", () => {
        console.log("MongoDB Connection Successful");
    });
}
