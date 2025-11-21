import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getChatrooms, createChatroom, joinChatroom } from "../services/chatApi";
import { logoutUser } from "../services/authApi";
import { IChatroom } from "@chat-app/shared/types.js";

const ChatLobby = () => {
	const navigate = useNavigate();

	const [rooms, setRooms] = useState<IChatroom[]>([]);
	const [newRoomName, setNewRoomName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchRooms();
	}, []);

	const fetchRooms = async () => {
		try {
			const data = await getChatrooms();
			setRooms(data);
		} catch (err) {
			console.error(err);
			setError("Failed to load chatrooms.");
		}
	};

	const handleCreateRoom = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newRoomName.trim()) return;

		setLoading(true);
		setError(null);

		try {
			const newRoom = await createChatroom(newRoomName);
			setRooms((prev) => [...prev, newRoom]);
			setNewRoomName("");
		} catch (err: any) {
			setError(err.message || "Failed to create room.");
		} finally {
			setLoading(false);
		}
	};

	const handleJoinRoom = async (roomId: string) => {
		if (!roomId) return;

		try {
			await joinChatroom(roomId);
			navigate(`/chat/${roomId}`);
		} catch (err: any) {
			console.error("Join error:", err);
			navigate(`/chat/${roomId}`);
		}
	};

	const handleLogout = () => {
		logoutUser();
		navigate("/");
	};

	return (
		<div className="min-h-screen bg-gray-900 p-6 md:p-12">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
					<h1 className="text-3xl font-bold text-white tracking-tight">
						Welcome to the Community Hub
					</h1>
					<button
						onClick={handleLogout}
						className="text-sm font-semibold text-red-400 hover:text-red-300 border border-red-900/50 bg-red-900/20 px-4 py-2 rounded transition-colors">
						Sign Out
					</button>
				</div>

				<div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10">
					<h2 className="text-lg font-semibold mb-4 text-gray-200">Create a Room </h2>
					<form
						onSubmit={handleCreateRoom}
						className="flex flex-col sm:flex-row gap-3">
						<input
							type="text"
							value={newRoomName}
							onChange={(e) => setNewRoomName(e.target.value)}
							placeholder="Room name"
							className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
							disabled={loading}
						/>
						<button
							type="submit"
							disabled={loading || !newRoomName.trim()}
							className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 transition-all">
							{loading ? "Creating..." : "Create Room"}
						</button>
					</form>
					{error && <p className="text-red-400 mt-3 text-sm flex items-center">⚠️ {error}</p>}
				</div>

				<h3 className="text-xl font-bold text-gray-200 mb-6">Available Rooms</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{rooms.map((room) => (
						<div
							key={room._id}
							className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 hover:shadow-md hover:border-blue-500/50 transition-all group">
							<div className="flex justify-between items-start mb-4">
								<div>
									<h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
										{room.name}
									</h4>
									<p className="text-xs text-gray-500 mt-1">ID: {room._id?.slice(-6)}</p>
								</div>
								<span className="bg-blue-900/30 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-900/50">
									{room.users.length} 👥
								</span>
							</div>

							<div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
								<span>{room.chatLogs?.length || 0} messages</span>
							</div>

							<button
								onClick={() => room._id && handleJoinRoom(room._id)}
								className="w-full mt-4 bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200">
								Join Discussion
							</button>
						</div>
					))}
				</div>

				{rooms.length === 0 && !loading && (
					<div className="flex flex-col items-center justify-center py-20 bg-gray-800 rounded-xl border border-dashed border-gray-600">
						<p className="text-gray-400 text-lg">No active rooms found.</p>
						<p className="text-gray-500 text-sm mt-1">Be the first to create one!</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatLobby;
