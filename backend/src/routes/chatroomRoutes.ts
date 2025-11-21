import express from "express";
import {
	createChatroom,
	getChatrooms,
	getChatroom,
	joinChatroom,
	sendMessage,
	getRoomMessages,
} from "../controllers/chatroomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getChatrooms).post(protect, createChatroom);

router.get("/:roomId", protect, getChatroom);

router.post("/join/:roomId", protect, joinChatroom);
router.route("/:roomId/messages").get(protect, getRoomMessages).post(protect, sendMessage);

export default router;
