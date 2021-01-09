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
import { JoinRoom, User, Users, LogItemServer, LogItemClient, Room, UserIds } from '@toybox/chat-app-interfaces';
import { RedisCacheService } from '../../redis-cache/services/redis-cache.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private logger: Logger = new Logger('ChatGateway');

	constructor(private redisCacheService: RedisCacheService) {
		// Initialize redis cache
		//this.redisCacheService.reset();
	}

	@SubscribeMessage('messageToServer')
	async handleMessage(@MessageBody() $payload: LogItemClient, @ConnectedSocket() $client: Socket): Promise<void> {
		this.logger.log($payload);

		const user: User = await this.redisCacheService.get(`users:${$client.id}`);
		const logItem: LogItemServer = {
			username: user.username,
			userColor: user.userColor,
			message: $payload.message,
			createdAt: new Date()
		};

		this.server.to(user.roomId).emit('messageToClient', logItem);
	}

	@SubscribeMessage('getRoomInfo')
	async getRoomInfo(@ConnectedSocket() $client: Socket): Promise<WsResponse<{ users: Users; roomName: string }>> {
		const users: Users = {};
		const user: User = await this.redisCacheService.get(`users:${$client.id}`);
		const roomId: string = user.roomId;
		const room: Room = await this.redisCacheService.get(`rooms:${roomId}`);
		const roomName: string = room.roomName;
		const userIds: UserIds = room.userIds;
		const userIdsList: string[] = Object.keys(userIds).map(($item: string) => `users:${$item}`);
		const usersList: User[] = await this.redisCacheService.mget(...userIdsList);

		usersList.forEach(($item: User) => {
			users[$item.userId] = $item;
		});

		return { event: 'getRoomInfo', data: { users, roomName } };
	}

	@SubscribeMessage('joinRoom')
	async createRoom(@MessageBody() $payload: JoinRoom, @ConnectedSocket() $client: Socket): Promise<void> {
		this.logger.log($payload);

		const user: User = {
			userId: $client.id,
			username: 'Guest_' + this._generateUniqueId(),
			roomId: $payload.roomId,
			icon: '',
			userColor: '#' + this._getRandomColor()
		};
		let room: Room = await this.redisCacheService.get(`rooms:${$payload.roomId}`);

		// room
		if (!room) {
			room = {
				roomId: $payload.roomId,
				roomName: $payload.roomName,
				userIds: {
					[$client.id]: true
				}
			};
		} else {
			room.userIds[$client.id] = true;
		}

		// update a room
		await this.redisCacheService.set(`rooms:${$payload.roomId}`, room);

		// user
		await this.redisCacheService.set(`users:${$client.id}`, user);

		// group the client with a specific room
		$client.join($payload.roomId, ($error) => {
			if ($error) this.logger.error($error);
		});

		// broadcast new user
		this.server.to($payload.roomId).emit('newUserToClient', user);
	}

	afterInit(): void {
		this.logger.log('Init');
	}

	async handleDisconnect(@ConnectedSocket() $client: Socket): Promise<void> {
		this.logger.log(`Client disconnected: ${$client.id}`);

		const user: User = await this.redisCacheService.get(`users:${$client.id}`);

		this.logger.log(`Disconnected user: ${user}`);
		if (!user) return;

		// remove a user and room
		this._removeUserAndRoom(user);

		// broadcast a user just has been left the room
		this._broadcastRemoveUser(user.roomId, user.userId);
	}

	handleConnection(@ConnectedSocket() $client: Socket): void {
		this.logger.log(`Client connected: ${$client.id}`);
	}

	private async _removeUserAndRoom(user: User): Promise<void> {
		const room: Room = await this.redisCacheService.get(`rooms:${user.roomId}`);
		delete room.userIds[user.userId];
		const userIds: UserIds = room.userIds;

		if (Object.keys(userIds).length === 0 && userIds.constructor === Object) {
			// remove a room
			await this.redisCacheService.del(`rooms:${user.roomId}`);
		} else {
			// remove a userId from the room
			await this.redisCacheService.set(`rooms:${user.roomId}`, room);
		}

		// remove a user
		await this.redisCacheService.del(`users:${user.userId}`);
	}

	private _broadcastRemoveUser($roomId: string, $userId: string): void {
		this.server.to($roomId).emit('removeUserToClient', $userId);
	}

	private _generateUniqueId(): string {
		return Math.random().toString(36).substr(2, 9);
	}

	private _getRandomColor(): string {
		return Math.floor(Math.random() * 16777215).toString(16);
	}
}
