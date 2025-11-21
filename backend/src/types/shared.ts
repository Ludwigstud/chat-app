export interface IMessage {
	_id?: string;
	userId: string;
	username: string;
	message: string;
	date: Date;
}

export interface IChatroom {
	_id?: string;
	name: string;
	users: string[];
	chatLogs: IMessage[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUser {
	_id?: string;
	username: string;
	password: string;
	email: string;
	chatrooms: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface AuthResponse {
	token: string;
	user: {
		id: string;
		email: string;
		username: string;
	};
}

export interface LoginData {
	email: string;
	password: string;
}

export interface RegistrationData extends LoginData {
	username: string;
}
