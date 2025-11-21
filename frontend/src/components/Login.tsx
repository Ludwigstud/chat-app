import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { loginUser } from "../services/authApi";
import { LoginData } from "@chat-app/shared/types.js";

const Login = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const credentials: LoginData = { email, password };

		try {
			await loginUser(credentials);

			navigate("/chat");
		} catch (err: any) {
			console.error("Login failed:", err);

			setError(err.message || "Invalid email or password.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
					<p className="text-gray-500 mt-2">Sign in to access your chat rooms</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-6">
					{error && (
						<div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
							⚠️ {error}
						</div>
					)}

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
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
						/>
					</div>

					<button
						type="submit"
						disabled={loading || !email || !password}
						className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-gray-500">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="text-blue-600 font-medium hover:underline">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
