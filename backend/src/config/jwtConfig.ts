import * as dotenv from "dotenv";
dotenv.config();

const rawSecret = process.env.JWT_SECRET;

// 1. Validation: Fail immediately if the secret is missing
if (!rawSecret || rawSecret.length === 0) {
	throw new Error("FATAL: JWT_SECRET environment variable is not set. Cannot start server.");
}

// 2. Transformation: Convert string to Uint8Array for 'jose' library
export const secret = new TextEncoder().encode(rawSecret);
