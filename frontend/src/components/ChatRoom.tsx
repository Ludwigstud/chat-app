import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { getRoomMessages, sendMessage, getChatroom } from "../services/chatApi";
import { getCurrentUserId } from "../services/authService";
import { IMessage } from "@chat-app/shared/types.js";

interface RoomMember {
	_id: string;
	username: string;
}

const ChatRoom = () => {
	const { roomId } = useParams<{ roomId: string }>();
	const navigate = useNavigate();

	const [messages, setMessages] = useState<IMessage[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [roomName, setRoomName] = useState<string>("");
	const [members, setMembers] = useState<RoomMember[]>([]);

	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const currentUserId = getCurrentUserId();

	useEffect(() => {
		const fetchRoomDetails = async () => {
			if (!roomId) return;
			try {
				const room = await getChatroom(roomId);
				setRoomName(room.name);
				setMembers(room.users as unknown as RoomMember[]);
			} catch (error) {
				console.error("Failed to fetch room details", error);
			}
		};
		fetchRoomDetails();
	}, [roomId]);

	const fetchMessages = async () => {
		if (!roomId) return;
		try {
			const data = await getRoomMessages(roomId);
			setMessages((prev) => {
				if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
				return data;
			});
		} catch (error) {
			console.error("Failed to load messages", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!roomId) {
			navigate("/chat");
			return;
		}
		fetchMessages();
		const interval = setInterval(fetchMessages, 3000);
		return () => clearInterval(interval);
	}, [roomId, navigate]);

	useEffect(() => {
		const container = chatContainerRef.current;
		if (!container) return;
		const isNearBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight < 200;

		if (loading || isNearBottom) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, loading]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !roomId) return;

		setSending(true);
		try {
			const sentMsg = await sendMessage(roomId, newMessage);
			setMessages((prev) => [...prev, sentMsg]);
			setNewMessage("");

			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		} catch (err) {
			console.error("Failed to send", err);
			alert("Failed to send message");
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="flex h-screen w-full bg-gray-900">
			<div className="flex-1 flex flex-col h-full min-w-0">
				{/* Header */}
				<div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center z-10 w-full shadow-sm">
					<div>
						<h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
							<span className="text-blue-500">#</span>
							{roomName || "Chat Room"}
						</h2>
						<p className="text-xs text-gray-400">ID: {roomId?.slice(-6)}</p>
					</div>
					<button
						onClick={() => navigate("/lobby")}
						className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
						&larr; Lobby
					</button>
				</div>

				<div
					ref={chatContainerRef}
					className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col w-full bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
					{loading && <div className="text-center text-gray-500 mt-10">Loading messages...</div>}

					{!loading &&
						messages.map((msg, index) => {
							const isMe = currentUserId === msg.userId;

							return (
								<div
									key={msg._id || index}
									className={`flex flex-col max-w-[85%] md:max-w-[70%] ${
										isMe ? "self-end items-end" : "self-start items-start"
									}`}>
									<div
										className={`px-4 py-2 shadow-sm ${
											isMe
												? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
												: "bg-gray-800 text-gray-100 border border-gray-700 rounded-2xl rounded-tl-none"
										}`}>
										{!isMe && (
											<span className="block text-[10px] font-bold text-blue-400 mb-1 opacity-90">
												{msg.username}
											</span>
										)}
										<p className="text-sm leading-relaxed">{msg.message}</p>
									</div>
									<span className="text-[10px] text-gray-500 mt-1 px-1">
										{new Date(msg.date).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
							);
						})}
					<div ref={messagesEndRef} />
				</div>

				<div className="bg-gray-800 p-4 border-t border-gray-700 w-full">
					<form
						onSubmit={handleSendMessage}
						className="flex gap-3 w-full max-w-5xl mx-auto">
						<input
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							placeholder={`Message #${roomName || "room"}...`}
							className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all"
							disabled={sending}
						/>
						<button
							type="submit"
							disabled={!newMessage.trim() || sending}
							className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">
							Send
						</button>
					</form>
				</div>
			</div>

			<div className="hidden md:flex flex-col w-64 bg-gray-800 border-l border-gray-700 shadow-xl z-20">
				<div className="p-4 border-b border-gray-700 bg-gray-800/50">
					<h3 className="font-bold text-gray-300 text-sm uppercase tracking-wide">
						Members — {members.length}
					</h3>
				</div>
				<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
					{members.map((member) => (
						<div
							key={member._id}
							className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-blue-400 font-bold text-xs shadow-sm border border-gray-600">
								{member.username.substring(0, 2).toUpperCase()}
							</div>

							<div className="flex flex-col">
								<span
									className={`text-sm font-medium ${
										member._id === currentUserId ? "text-blue-400" : "text-gray-300"
									}`}>
									{member.username}
								</span>
								{member._id === currentUserId && (
									<span className="text-[10px] text-gray-500 font-medium">You</span>
								)}
							</div>
						</div>
					))}

					{members.length === 0 && (
						<p className="text-sm text-gray-500 italic text-center mt-4">Loading members...</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatRoom;
