import * as dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatroomRoutes from "./routes/chatroomRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(
	cors({
		origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
		credentials: true,
	}),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chatrooms", chatroomRoutes);

app.get("/", (req: Request, res: Response) => {
	res.send("Chat App API is running");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
