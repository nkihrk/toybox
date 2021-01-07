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
import { JoinRoom, User, Users, LogItemServer, LogItemClient, Rooms, Room, UserIds } from '@toybox/chat-app-interfaces';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
			userColor: user.userColor,
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

	@SubscribeMessage('getRoomName')
	getRoomName(@ConnectedSocket() $client: Socket): WsResponse<string> {
		const roomId: string = this.users[$client.id].roomId;
		const roomName: string = this.rooms[roomId].roomName;

		return { event: 'getRoomName', data: roomName };
	}

	@SubscribeMessage('joinRoom')
	createRoom(@MessageBody() $payload: JoinRoom, @ConnectedSocket() $client: Socket): void {
		//this.logger.log($payload);

		const user: User = {
			userId: $client.id,
			username: 'Guest_' + this._generateUniqueId(),
			roomId: $payload.roomId,
			icon: '',
			userColor: '#' + this._getRandomColor()
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

		// remove a specific user from the lists
		this._removeUserFromLists(user.roomId, user.userId);

		const userIds: UserIds = this.rooms[user.roomId].users;
		if (Object.keys(userIds).length === 0 && userIds.constructor === Object) this._removeRoomFromList(user.roomId);

		// broadcast a user just has been left the room
		this._broadcastRemoveUser(user.roomId, user.userId);
	}

	handleConnection($client: Socket, ...args: any[]): void {
		this.logger.log(`Client connected: ${$client.id}`);
	}

	private _generateUniqueId(): string {
		return Math.random().toString(36).substr(2, 9);
	}

	private _removeUserFromLists($roomId: string, $userId: string): void {
		delete this.rooms[$roomId].users[$userId];
		delete this.users[$userId];
	}

	private _removeRoomFromList($roomId: string): void {
		delete this.rooms[$roomId];
	}

	private _broadcastRemoveUser($roomId: string, $userId: string): void {
		this.server.to($roomId).emit('removeUserToClient', $userId);
	}

	private _getRandomColor(): string {
		return Math.floor(Math.random() * 16777215).toString(16);
	}
}
