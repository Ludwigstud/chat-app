import { Request, Response } from "express";
import { Chatroom } from "../models/Chatroom.js";
import { User } from "../models/User.js";
import { IMessage } from "@chat-app/shared/types.js";

interface AuthRequest extends Request {
	userId?: string;
}

export const createChatroom = async (req: Request, res: Response) => {
	const userId = (req as AuthRequest).userId;
	const { name } = req.body;

	if (!userId) return res.status(401).json({ message: "Authentication required." });
	if (!name || name.trim().length < 3) {
		return res.status(400).json({ message: "Room name must be at least 3 characters long." });
	}

	try {
		const existingRoom = await Chatroom.findOne({ name });
		if (existingRoom) return res.status(409).json({ message: "Chatroom already exists." });

		const newRoom = await Chatroom.create({
			name: name.trim(),
			users: [userId],
			chatLogs: [],
		});

		await User.findByIdAndUpdate(userId, { $push: { chatrooms: newRoom._id } });

		return res.status(201).json({
			message: "Chatroom created.",
			room: { id: newRoom._id, name: newRoom.name, users: newRoom.users },
		});
	} catch (error) {
		console.error("Error creating chatroom:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
};

export const getChatrooms = async (req: Request, res: Response) => {
	try {
		const rooms = await Chatroom.find({}, "name _id users createdAt");
		return res.status(200).json(rooms);
	} catch (error) {
		console.error("Error fetching chatrooms:", error);
		return res.status(500).json({ message: "Server error." });
	}
};

export const joinChatroom = async (req: Request, res: Response) => {
	const userId = (req as AuthRequest).userId;
	const { roomId } = req.params;

	if (!userId) return res.status(401).json({ message: "Authentication required." });

	try {
		const room = await Chatroom.findById(roomId);
		if (!room) return res.status(404).json({ message: "Chatroom not found." });

		if (room.users.includes(userId)) {
			return res.status(200).json({ message: "User already a member." });
		}

		await Chatroom.findByIdAndUpdate(roomId, {
			$push: { users: userId },
			$set: { updatedAt: new Date() },
		});

		await User.findByIdAndUpdate(userId, { $push: { chatrooms: roomId } });
		return res.status(200).json({ message: "Joined chatroom." });
	} catch (error) {
		console.error("Error joining chatroom:", error);
		return res.status(500).json({ message: "Server error." });
	}
};

export const sendMessage = async (req: Request, res: Response) => {
	const userId = (req as AuthRequest).userId;
	const { roomId } = req.params;
	const { message } = req.body;

	if (!userId) return res.status(401).json({ message: "Authentication required." });
	if (!message || !message.trim()) return res.status(400).json({ message: "Message empty." });

	try {
		const user = await User.findById(userId).select("username");

		if (!user) {
			return res.status(404).json({ message: "Sender profile not found." });
		}

		const room = await Chatroom.findById(roomId);
		if (!room) return res.status(404).json({ message: "Chatroom not found." });
		if (!room.users.includes(userId)) return res.status(403).json({ message: "Not a member." });

		const newMessage: IMessage = {
			userId: userId,
			username: user.username,
			message: message.trim(),
			date: new Date(),
		};

		await Chatroom.findByIdAndUpdate(roomId, {
			$push: { chatLogs: newMessage },
			$set: { updatedAt: newMessage.date },
		});

		return res.status(201).json({ message: "Sent.", data: newMessage });
	} catch (error) {
		console.error("Error sending message:", error);
		return res.status(500).json({ message: "Server error." });
	}
};

export const getRoomMessages = async (req: Request, res: Response) => {
	const userId = (req as AuthRequest).userId;
	const { roomId } = req.params;

	if (!userId) return res.status(401).json({ message: "Authentication required." });

	try {
		const room = await Chatroom.findById(roomId, "chatLogs users");
		if (!room) return res.status(404).json({ message: "Chatroom not found." });
		if (!room.users.includes(userId)) return res.status(403).json({ message: "Not a member." });

		return res.status(200).json(room.chatLogs);
	} catch (error) {
		console.error("Error fetching messages:", error);
		return res.status(500).json({ message: "Server error." });
	}
};
