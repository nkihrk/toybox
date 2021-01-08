export interface Rooms {
	[key: string]: Room;
}

export interface Room {
	roomId: string;
	roomName: string;
	userIds: UserIds;
}

export interface UserIds {
	[key: string]: boolean;
}
