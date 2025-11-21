import { Schema } from "mongoose";
import { IMessage } from "../types/shared.js";

export const MessageSchema = new Schema<IMessage>(
	{
		userId: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
			maxlength: 1000,
		},
		date: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	{
		_id: true,
	},
);
