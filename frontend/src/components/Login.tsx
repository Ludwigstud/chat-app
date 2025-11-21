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
			navigate("/lobby");
		} catch (err: any) {
			console.error("Login failed:", err);
			setError(err.message || "Invalid email or password.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-900">
			<div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-white">Welcome Back</h1>
					<p className="text-gray-400 mt-2">Sign in to access your chat rooms</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-6">
					{error && (
						<div className="bg-red-900/30 text-red-400 text-sm p-3 rounded-md border border-red-800">
							⚠️ {error}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
						<input
							type="email"
							required
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
						<input
							type="password"
							required
							className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
						/>
					</div>

					<button
						type="submit"
						disabled={loading || !email || !password}
						className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-900/20">
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-gray-400">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="text-blue-400 font-medium hover:text-blue-300 hover:underline">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
