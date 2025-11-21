import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@chat-app/shared/types.js";

export interface IUserWithMethods extends Omit<IUser, "_id">, Document {
	comparePassword(candidatePassword: string): Promise<boolean>;
}

export const UserSchema = new Schema<IUserWithMethods>(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			minlength: [3, "Username must be at least 3 characters long"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			match: [/.+@.+\..+/, "Please enter a valid email address"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
		},
		chatrooms: [
			{
				type: Schema.Types.ObjectId,
				ref: "Chatroom",
				default: [],
			},
		],
	},
	{
		timestamps: true,
	},
);

UserSchema.pre<IUserWithMethods>("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error as Error);
	}
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUserWithMethods>("User", UserSchema);
