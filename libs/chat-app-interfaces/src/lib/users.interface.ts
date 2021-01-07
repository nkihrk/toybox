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
