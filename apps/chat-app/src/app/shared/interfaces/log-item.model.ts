export interface LogItemClient {
	message: string;
}

export interface LogItemServer {
	username: string;
	userColor: string;
	message: string;
	createdAt: Date;
}
