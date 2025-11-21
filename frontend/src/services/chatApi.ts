import { api } from "./apiClient";
import { IChatroom, IMessage } from "@chat-app/shared/types.js";

export const getChatrooms = async (): Promise<IChatroom[]> => {
	return api<IChatroom[]>("/chatrooms");
};

export const createChatroom = async (name: string): Promise<IChatroom> => {
	return api<IChatroom>("/chatrooms", {
		method: "POST",
		body: JSON.stringify({ name }),
	});
};

export const joinChatroom = async (roomId: string): Promise<IChatroom> => {
	return api<IChatroom>(`/chatrooms/join/${roomId}`, {
		method: "POST",
	});
};

export const getRoomMessages = async (roomId: string): Promise<IMessage[]> => {
	return api<IMessage[]>(`/chatrooms/${roomId}/messages`);
};

export const sendMessage = async (roomId: string, message: string): Promise<IMessage> => {
	return api<IMessage>(`/chatrooms/${roomId}/messages`, {
		method: "POST",
		body: JSON.stringify({ message }),
	});
};
