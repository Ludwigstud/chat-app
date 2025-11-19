import { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import {} from "../types/express.d.js";
const JWT_SECRET = process.env.JWT_SECRET || "your_long_secure_key";
const secret = new TextEncoder().encode(JWT_SECRET);
const ALGORITHM = "HS256";

interface AuthRequest extends Request {
	userId?: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];

			const { payload } = await jose.jwtVerify(token, secret, {
				algorithms: [ALGORITHM],
			});

			if (payload.id) {
				(req as AuthRequest).userId = payload.id as string;
				next();
			} else {
				console.error("JWT payload missing user ID.");
				return res.status(401).json({ message: "Not authorized, token payload invalid." });
			}
		} catch (error) {
			console.error("JWT verification failed:", error);
			return res.status(401).json({ message: "Not authorized, token failed." });
		}
	}

	if (!token) {
		return res.status(401).json({ message: "Not authorized, no token provided." });
	}
};
