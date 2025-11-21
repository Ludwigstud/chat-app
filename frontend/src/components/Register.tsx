import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { registerUser } from "../services/authApi";
import { RegistrationData } from "@chat-app/shared/types.js";

const Register = () => {
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const credentials: RegistrationData = { username, email, password };

		try {
			await registerUser(credentials);

			navigate("/chat");
		} catch (err: any) {
			console.error("Registration failed:", err);
			setError(err.message || "Failed to create account. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
					<p className="text-gray-500 mt-2">Join the community today</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-5">
					{error && (
						<div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
							⚠️ {error}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
						<input
							type="text"
							required
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							placeholder="johndoe"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={loading}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
						<input
							type="email"
							required
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							type="password"
							required
							minLength={6}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
						/>
					</div>

					<button
						type="submit"
						disabled={loading || !email || !password || !username}
						className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
						{loading ? "Creating Account..." : "Sign Up"}
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-gray-500">
					Already have an account?{" "}
					<Link
						to="/"
						className="text-blue-600 font-medium hover:underline">
						Log in
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
