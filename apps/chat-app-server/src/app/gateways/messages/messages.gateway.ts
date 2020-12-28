import { SubscribeMessage, WebSocketGateway, WsResponse, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MessagesGateway {
	@WebSocketServer() server: Server;

	@SubscribeMessage('broadcast')
	broadcast(@MessageBody() data: LogItem): void {
		this.server.emit('broadcast', data);
	}
}

interface LogItem {
	name: string;
	post: string;
	createdAt: Date;
}
