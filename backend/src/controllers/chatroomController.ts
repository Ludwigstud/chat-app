import { Request, Response } from "express";
import { Chatroom } from "../models/Chatroom.js";
import { User } from "../models/User.js";
import { IMessage } from "@chat-app/shared/types.js";

// Helper interface for Authenticated Requests
interface AuthRequest extends Request {
	userId?: string;
}

// --- 1. Get List of Rooms ---
export const getChatrooms = async (req: Request, res: Response) => {
	try {
		// Projection: Only fetch fields we need for the card view
		const rooms = await Chatroom.find({}, "name _id users createdAt");
		return res.status(200).json(rooms);
	} catch (error) {
		console.error("Error fetching chatrooms:", error);
		return res.status(500).json({ message: "Server error." });
	}
};

// --- 2. Get Single Room (NEW - Required for your frontend update) ---
export const getChatroom = async (req: Request, res: Response) => {
	try {
		const { roomId } = req.params;
		const room = await Chatroom.findById(roomId);

		if (!room) {
			return res.status(404).json({ message: "Chatroom not found" });
		}

		return res.status(200).json(room);
	} catch (error) {
		console.error("Error fetching single room:", error);
		return res.status(500).json({ message: "Server Error" });
	}
};

// --- 3. Create Room ---
export const createChatroom = async (req: Request, res: Response) => {
	const userId = (req as AuthRequest).userId;
	const { name } = req.body;

	if (!userId) return res.status(401).json({ message: "Authentication required." });

	const cleanName = name?.trim();
	if (!cleanName || cleanName.length < 3) {
		return res.status(400).json({ message: "Room name must be at least 3 characters long." });
	}

	try {
		const existingRoom = await Chatroom.findOne({ name: cleanName });
		if (existingRoom) return res.status(409).json({ message: "Chatroom already exists." });

		const newRoom = await Chatroom.create({
			name: cleanName,
			users: [userId],
			chatLogs: [],
		});

		// Add room to user's list
		await User.findByIdAndUpdate(userId, { $push: { chatrooms: newRoom._id } });

		// Return the created resource directly
		return res.status(201).json(newRoom);
	} catch (error) {
		console.error("Error creating chatroom:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
};

// --- 4. Join Room ---
export const joinChatroom = async (req: Request, res: Response) => {
	const userId = (req as AuthRequest).userId;
	const { roomId } = req.params;

	if (!userId) return res.status(401).json({ message: "Authentication required." });

	try {
		const room = await Chatroom.findById(roomId);
		if (!room) return res.status(404).json({ message: "Chatroom not found." });

		// Idempotency: If already in room, just return success
		if (room.users.includes(userId)) {
			return res.status(200).json(room);
		}

		// Add user to room
		const updatedRoom = await Chatroom.findByIdAndUpdate(
			roomId,
			{
				$push: { users: userId },
				$set: { updatedAt: new Date() },
			},
			{ new: true }, // Return updated doc
		);

		// Add room to user
		await User.findByIdAndUpdate(userId, { $push: { chatrooms: roomId } });

		return res.status(200).json(updatedRoom);
	} catch (error) {
		console.error("Error joining chatroom:", error);
		return res.status(500).json({ message: "Server error." });
	}
};

// --- 5. Send Message ---
export const sendMessage = async (req: Request, res: Response) => {
	const userId = (req as AuthRequest).userId;
	const { roomId } = req.params;
	const { message } = req.body;

	if (!userId) return res.status(401).json({ message: "Authentication required." });
	if (!message || !message.trim()) return res.status(400).json({ message: "Message empty." });

	try {
		// Fetch strictly what is needed
		const user = await User.findById(userId).select("username");
		if (!user) return res.status(404).json({ message: "User not found." });

		// Verify room membership
		const room = await Chatroom.findById(roomId).select("users");
		if (!room) return res.status(404).json({ message: "Chatroom not found." });
		if (!room.users.includes(userId)) return res.status(403).json({ message: "Not a member." });

		// Construct Message
		const newMessage: IMessage = {
			userId: userId,
			username: user.username,
			message: message.trim(),
			date: new Date(),
		};

		// Push to DB
		// Note: In a production app with heavy load, use a separate Messages collection.
		// For a hobby MERN app, embedding is fine.
		await Chatroom.findByIdAndUpdate(roomId, {
			$push: { chatLogs: newMessage },
			$set: { updatedAt: newMessage.date },
		});

		// REFACTOR FIX: Return the Message object directly!
		// Old code returned { message: "Sent", data: ... } which breaks frontend typing.
		return res.status(201).json(newMessage);
	} catch (error) {
		console.error("Error sending message:", error);
		return res.status(500).json({ message: "Server error." });
	}
};

// --- 6. Get Messages ---
export const getRoomMessages = async (req: Request, res: Response) => {
	const userId = (req as AuthRequest).userId;
	const { roomId } = req.params;

	if (!userId) return res.status(401).json({ message: "Authentication required." });

	try {
		// Optimization: Only fetch chatLogs and users array (for auth check)
		const room = await Chatroom.findById(roomId).select("chatLogs users");

		if (!room) return res.status(404).json({ message: "Chatroom not found." });

		// Security: Ensure user is actually in the room
		if (!room.users.includes(userId)) {
			return res.status(403).json({ message: "Access denied. Join the room first." });
		}

		return res.status(200).json(room.chatLogs);
	} catch (error) {
		console.error("Error fetching messages:", error);
		return res.status(500).json({ message: "Server error." });
	}
};
