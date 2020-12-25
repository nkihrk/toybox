import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromChats from './+state/chats/chats.reducer';
import { ChatsEffects } from './+state/chats/chats.effects';
import { ChatsFacade } from './+state/chats/chats.facade';

@NgModule({
	declarations: [ChatComponent],
	imports: [
		CommonModule,
		SharedModule,
		ChatRoutingModule,
		StoreModule.forFeature(fromChats.CHATS_FEATURE_KEY, fromChats.reducer),
		EffectsModule.forFeature([ChatsEffects])
	],
	providers: [ChatsFacade]
})
export class ChatModule {}
