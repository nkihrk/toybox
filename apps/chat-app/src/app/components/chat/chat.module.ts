import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';

@NgModule({
	declarations: [ChatComponent],
	imports: [CommonModule, SharedModule, ChatRoutingModule]
})
export class ChatModule {}
