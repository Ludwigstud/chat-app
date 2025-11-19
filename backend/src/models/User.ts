import { Schema, model } from "mongoose";
import { IUser } from "@chat-app/shared/types.js";

export const UserSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			minlength: [3, "Username must be at least 3 characters long"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
		},

		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			match: [/.+@.+\..+/, "Please enter a valid email address"],
		},
		chatrooms: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

export const User = model<IUser>("User", UserSchema);
