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
