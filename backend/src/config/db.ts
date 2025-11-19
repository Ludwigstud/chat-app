import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
	const mongoUri = process.env.MONGO_URI;

	if (!mongoUri) {
		console.error(
			"FATAL: MONGO_URI is not defined in your environment variables. Check your .env file.",
		);

		process.exit(1);
	}

	try {
		const conn = await mongoose.connect(mongoUri);

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: Failed to connect to MongoDB.`);

		process.exit(1);
	}
};
