import { Schema, model } from "mongoose";
import { IChatroom } from "../types/shared.js";
import { MessageSchema } from "./Message.js";

export const ChatroomSchema = new Schema<IChatroom>(
	{
		name: {
			type: String,
			required: [true, "Chatroom name is required"],
			unique: true,
			trim: true,
			minlength: [3, "Chatroom name must be at least 3 characters long"],
		},

		users: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		chatLogs: {
			type: [MessageSchema],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

export const Chatroom = model<IChatroom>("Chatroom", ChatroomSchema);
