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
	@WebSocketServer() private readonly server: Server;

	private logger: Logger = new Logger('ChatGateway');

	constructor(private redisCacheService: RedisCacheService) {
		// Initialize redis cache
		//this.redisCacheService.reset();
	}

	@SubscribeMessage('messageToServer')
	async handleMessage(@MessageBody() $payload: LogItemClient, @ConnectedSocket() $client: Socket): Promise<void> {
		this.logger.log($payload);

		try {
			const user: User = await this.redisCacheService.get(`users:${$client.id}`);
			const logItem: LogItemServer = {
				username: user.username,
				userColor: user.userColor,
				message: $payload.message,
				createdAt: new Date()
			};

			this.server.to(user.roomId).emit('messageToClient', logItem);
		} catch ($error) {
			this.logger.log($error);
		}
	}

	@SubscribeMessage('joinRoom')
	async createRoom(@MessageBody() $payload: JoinRoom, @ConnectedSocket() $client: Socket): Promise<void> {
		this.logger.log($payload);

		try {
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

			// add new user
			await this.redisCacheService.set(`users:${$client.id}`, user);

			// get all users in the current room
			const users: Users = await this._getUserInRoom(room.userIds, user);

			// group the client with a specific room
			this._clientJoin($client, $payload.roomId);

			// broadcast the room info
			this.server.to($payload.roomId).emit('roomInfoToClient', { user, users, roomName: $payload.roomName });
		} catch ($error) {
			this.logger.log($error);
		}
	}

	afterInit(): void {
		this.logger.log('Init');
	}

	async handleDisconnect(@ConnectedSocket() $client: Socket): Promise<void> {
		this.logger.log(`Client disconnected: ${$client.id}`);

		try {
			const user: User = await this.redisCacheService.get(`users:${$client.id}`);

			if (!user) return;

			// remove a user and room
			this._removeUserAndRoom(user);

			// broadcast a user just has been left the room
			this._broadcastRemoveUser(user.roomId, user.userId);
		} catch ($error) {
			this.logger.log($error);
		}
	}

	handleConnection(@ConnectedSocket() $client: Socket): void {
		this.logger.log(`Client connected: ${$client.id}`);
	}

	private async _getUserInRoom($userIds: UserIds, $user: User): Promise<Users> {
		const users: Users = {};
		const userIds: UserIds = $userIds;
		const userIdsList: string[] = Object.keys(userIds).map(($item: string) => `users:${$item}`);
		const usersList: User[] = await this.redisCacheService.mget(...userIdsList);
		usersList.forEach(($item: User) => {
			if ($item) {
				users[$item.userId] = $item;
			} else {
				users[$user.userId] = $user;
			}
		});

		return users;
	}

	private _clientJoin($client: Socket, $roomId: string): void {
		$client.join($roomId, ($error) => {
			if ($error) this.logger.error($error);
		});
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
