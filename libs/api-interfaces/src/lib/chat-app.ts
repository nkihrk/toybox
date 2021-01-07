export interface JoinRoom {
	roomId: string;
	roomName: string;
}

export interface LogItemClient {
	message: string;
}

export interface LogItemServer {
	username: string;
	userColor: string;
	message: string;
	createdAt: Date;
}

export interface Rooms {
	[key: string]: Room;
}

export interface Room {
	roomId: string;
	roomName: string;
	users: UserIds;
}

export interface UserIds {
	[key: string]: boolean;
}

export interface Users {
	[key: string]: User;
}

export interface User {
	userId: string;
	username: string;
	roomId: string;
	icon: string;
	userColor: string;
}
