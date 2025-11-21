import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { getRoomMessages, sendMessage } from "../services/chatApi";
import { getCurrentUserId } from "../services/authService";
import { IMessage } from "@chat-app/shared/types.js";

const ChatRoom = () => {
	const { roomId } = useParams<{ roomId: string }>();
	const navigate = useNavigate();

	const [messages, setMessages] = useState<IMessage[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const currentUserId = getCurrentUserId();

	const fetchMessages = async () => {
		if (!roomId) return;
		try {
			const data = await getRoomMessages(roomId);
			setMessages(data);
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
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !roomId) return;

		setSending(true);
		try {
			const sentMsg = await sendMessage(roomId, newMessage);

			setMessages((prev) => [...prev, sentMsg]);

			setNewMessage("");
		} catch (err) {
			console.error("Failed to send", err);
			alert("Failed to send message");
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			<div className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center z-10">
				<div>
					<h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
						<span className="text-blue-500">#</span> Chat Room
					</h2>
					<p className="text-xs text-gray-400">ID: {roomId?.slice(-6)}</p>
				</div>
				<button
					onClick={() => navigate("/chat")}
					className="text-gray-500 hover:text-gray-800 text-sm font-medium">
					Back to Lobby
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
				{loading && <div className="text-center text-gray-400 mt-10">Loading...</div>}

				{!loading &&
					messages.map((msg, index) => {
						const isMe = currentUserId === msg.userId;

						return (
							<div
								key={msg._id || index}
								className={`flex flex-col max-w-[75%] ${
									isMe ? "self-end items-end" : "self-start items-start"
								}`}>
								<div
									className={`px-4 py-2 shadow-sm ${
										isMe
											? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
											: "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none"
									}`}>
									{!isMe && (
										<span className="block text-[10px] font-bold text-blue-600 mb-1 opacity-80">
											{msg.username}
										</span>
									)}
									<p className="text-sm leading-relaxed">{msg.message}</p>
								</div>
								<span className="text-[10px] text-gray-400 mt-1 px-1">
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

			<div className="bg-white p-4 border-t">
				<form
					onSubmit={handleSendMessage}
					className="flex gap-3 max-w-4xl mx-auto">
					<input
						type="text"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Type a message..."
						className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
						disabled={sending}
					/>
					<button
						type="submit"
						disabled={!newMessage.trim() || sending}
						className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">
						{sending ? "..." : "Send"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatRoom;
