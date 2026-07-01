import "./config/Dotenv.js";

import express from "express";
import connectMongoDB from "./config/Database.js";
import userRouter from "./routes/UserRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import orderRouter from "./routes/OrderRoutes.js";
import productRouter from "./routes/ProductRoutes.js";
import { User } from "./models/User.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    cors({
        origin: "http://localhost:3000", // your frontend URL
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);

app.use(express.static("public"));

connectMongoDB();

app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);
});

if (!(await User.find({ email: "admin@shop.com" }))) {
    await User.create({
        fullName: "Admin",
        email: "admin@shop.com",
        password: "Admin@123",
        phone: "0123456789",
    }).then(() => {
        console.log(
            "\nAdmin Credentials:\nEmail: admin@shop.com\nPassword: Admin@123\n",
        );
    });
} else {
    console.log(
        "\nAdmin Credentials:\nEmail: admin@shop.com\nPassword: Admin@123\n",
    );
}
