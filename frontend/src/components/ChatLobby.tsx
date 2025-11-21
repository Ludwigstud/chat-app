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
		<div className="min-h-screen bg-gray-50 p-6 md:p-12">
			<div className="max-w-6xl mx-auto">
			
				<div className="flex justify-between items-center mb-8 border-b pb-4">
					<h1 className="text-3xl font-bold text-gray-800 tracking-tight">ChatGen Lobby</h1>
					<button
						onClick={handleLogout}
						className="text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded transition-colors">
						Sign Out
					</button>
				</div>

			
				<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
					<h2 className="text-lg font-semibold mb-4 text-gray-700">Create a Workspace</h2>
					<form
						onSubmit={handleCreateRoom}
						className="flex flex-col sm:flex-row gap-3">
						<input
							type="text"
							value={newRoomName}
							onChange={(e) => setNewRoomName(e.target.value)}
							placeholder="Room name (e.g. 'Frontend Heroes')"
							className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							disabled={loading}
						/>
						<button
							type="submit"
							disabled={loading || !newRoomName.trim()}
							className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all">
							{loading ? "Creating..." : "Create Room"}
						</button>
					</form>
					{error && <p className="text-red-500 mt-3 text-sm flex items-center">⚠️ {error}</p>}
				</div>

		
				<h3 className="text-xl font-bold text-gray-800 mb-6">Available Rooms</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{rooms.map((room) => (
						<div
							key={room._id}
							className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
							<div className="flex justify-between items-start mb-4">
								<div>
									<h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
										{room.name}
									</h4>
									<p className="text-xs text-gray-400 mt-1">ID: {room._id?.slice(-6)}</p>
								</div>
								<span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
									{room.users.length} 👥
								</span>
							</div>

							<div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
								<span>{room.chatLogs?.length || 0} messages</span>
							</div>

							<button
								onClick={() => room._id && handleJoinRoom(room._id)}
								className="w-full mt-4 bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200">
								Join Discussion
							</button>
						</div>
					))}
				</div>

				{rooms.length === 0 && !loading && (
					<div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
						<p className="text-gray-500 text-lg">No active rooms found.</p>
						<p className="text-gray-400 text-sm mt-1">Be the first to create one!</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatLobby;
