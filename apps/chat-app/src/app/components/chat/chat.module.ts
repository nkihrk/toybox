import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { StatusComponent } from './status/status.component';
import { UsersComponent } from './users/users.component';
import { LogsComponent } from './logs/logs.component';
import { MessageInputComponent } from './message-input/message-input.component';
import { CreateRoomComponent } from './create-room/create-room.component';

@NgModule({
	declarations: [
		ChatComponent,
		StatusComponent,
		UsersComponent,
		LogsComponent,
		MessageInputComponent,
		CreateRoomComponent
	],
	imports: [CommonModule, SharedModule, ChatRoutingModule],
	providers: []
})
export class ChatModule {}
