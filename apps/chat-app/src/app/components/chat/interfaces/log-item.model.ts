export interface LogItemClient {
	message: string;
}

export interface LogItemServer {
	username: string;
	message: string;
	createdAt: Date;
}
