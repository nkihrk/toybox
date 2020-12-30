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
	private rooms: Room[] = [];

	@SubscribeMessage('broadcast')
	broadcast(@MessageBody() $data: LogItem): void {
		this.server.emit('broadcast', $data);
	}

	@SubscribeMessage('room')
	handleNewRoom(@MessageBody() $data: Room): WsResponse<Room> {
		this.rooms.push($data);

		return { event: 'room', data: $data };
	}

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, payload: string): void {
		this.server.emit('msgToClient', payload);
	}

	@SubscribeMessage('createRoom')
	createRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
		client.join(data, ($error: any) => {
			if ($error) {
				this.logger.error($error);
			}
		});
	}

	afterInit(server: Server): void {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket): void {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]): void {
		this.logger.log(`Client connected: ${client.id}`);
	}
}

interface Room {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	users: User[];
	owner: string; // Must be user id
}

interface User {
	id: string;
	username: string;
	createdAt: Date;
	updatedAt: Date;
}

interface LogItem {
	name: string;
	post: string;
	createdAt: Date;
}
