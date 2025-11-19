const JWT_SECRET = process.env.JWT_SECRET || "your_long_secure_key";

if (!JWT_SECRET || JWT_SECRET.length === 0) {
	throw new Error("FATAL: JWT_SECRET environment variable is not set. Cannot start server.");
}


export const secret = new TextEncoder().encode(JWT_SECRET);
