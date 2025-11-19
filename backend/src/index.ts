import * as dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatroomRoutes from "./routes/chatroomRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chatrooms", chatroomRoutes);

//test route
app.get("/", (req: Request, res: Response) => {
	res.send("Chat App API is running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
