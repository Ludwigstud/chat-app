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
