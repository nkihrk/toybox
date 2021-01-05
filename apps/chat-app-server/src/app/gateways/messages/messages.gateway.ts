import {
	SubscribeMessage,
	WebSocketGateway,
	ConnectedSocket,
	WsResponse,
	MessageBody,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private logger: Logger = new Logger('AppGateway');
	private rooms: Rooms = {};
	private users: Users = {};

	@SubscribeMessage('messageToServer')
	handleMessage(@MessageBody() $payload: LogItemClient, @ConnectedSocket() $client: Socket): void {
		this.logger.log($payload);

		const user: User = this.users[$client.id];
		const logItem: LogItemServer = {
			username: user.username,
			message: $payload.message,
			createdAt: new Date()
		};

		this.server.to(user.roomId).emit('messageToClient', logItem);
	}

	@SubscribeMessage('getUsers')
	getUsers(@ConnectedSocket() $client: Socket): WsResponse<Users> {
		const roomId: string = this.users[$client.id].roomId;
		const userIds: UserIds = this.rooms[roomId].users;
		const users: Users = {};

		for (const userId in userIds) {
			users[userId] = this.users[userId];
		}

		return { event: 'getUsers', data: users };
	}

	@SubscribeMessage('joinRoom')
	createRoom(@MessageBody() $payload: JoinRoom, @ConnectedSocket() $client: Socket): void {
		//this.logger.log($payload);

		const user: User = {
			userId: $client.id,
			username: 'Guest_' + this._generateUniqueId(),
			roomId: $payload.roomId
		};

		// group the client to a specific room
		$client.join($payload.roomId, ($error: any) => {
			if ($error) this.logger.error($error);
		});

		// room
		if (!this.rooms[$payload.roomId]) {
			const room: Room = {
				roomId: $payload.roomId,
				roomName: $payload.roomName,
				users: {
					[$client.id]: true
				}
			};

			this.rooms[$payload.roomId] = room;
		} else {
			this.rooms[$payload.roomId].users[$client.id] = true;
		}

		// user
		this.users[$client.id] = user;

		// broadcast new user
		this.server.to($payload.roomId).emit('newUserToClient', user);
	}

	afterInit($server: Server): void {
		this.logger.log('Init');
	}

	handleDisconnect($client: Socket): void {
		this.logger.log(`Client disconnected: ${$client.id}`);

		const user: User = this.users[$client.id];

		// removed the user info from the lists
		delete this.rooms[user.roomId].users[user.userId];
		delete this.users[user.userId];

		// broadcast a user just has been left the room
		this.server.to(user.roomId).emit('removeUserToClient', $client.id);
	}

	handleConnection($client: Socket, ...args: any[]): void {
		this.logger.log(`Client connected: ${$client.id}`);
	}

	private _generateUniqueId(): string {
		return Math.random().toString(36).substr(2, 9);
	}
}

interface Rooms {
	[key: string]: Room;
}

interface Room {
	roomId: string;
	roomName: string;
	users: UserIds;
}

interface UserIds {
	[key: string]: boolean;
}

interface Users {
	[key: string]: User;
}

interface User {
	userId: string;
	username: string;
	roomId: string;
	icon: string;
}

interface JoinRoom {
	roomId: string;
	roomName: string;
}

interface LogItemServer {
	username: string;
	message: string;
	createdAt: Date;
}

interface LogItemClient {
	message: string;
}
