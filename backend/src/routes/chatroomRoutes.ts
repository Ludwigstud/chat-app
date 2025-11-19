import express from "express";
import {
	createChatroom,
	getChatrooms,
	joinChatroom,
	sendMessage,
	getRoomMessages,
} from "../controllers/chatroomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//Apply middleware to all routes
router.use(protect);

// ROOM MANAGEMENT
router.post("/", createChatroom);
router.get("/", getChatrooms);
router.post("/join/:roomId", joinChatroom);

// MESSAGE MANAGEMENT
router.post("/:roomId/messages", sendMessage);
router.get("/:roomId/messages", getRoomMessages);

export default router;
