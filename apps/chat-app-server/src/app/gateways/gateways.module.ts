import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages/messages.gateway';

@Module({
	providers: [MessagesGateway]
})
export class GatewaysModule {}
