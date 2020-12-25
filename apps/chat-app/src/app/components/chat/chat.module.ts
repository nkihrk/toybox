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
import { StatusComponent } from './status/status.component';
import { UsersComponent } from './users/users.component';
import * as fromStatus from './+state/status/status.reducer';
import { StatusEffects } from './+state/status/status.effects';
import { StatusFacade } from './+state/status/status.facade';
import * as fromUsers from './+state/users/users.reducer';
import { UsersEffects } from './+state/users/users.effects';
import { UsersFacade } from './+state/users/users.facade';

@NgModule({
	declarations: [ChatComponent, StatusComponent, UsersComponent],
	imports: [
		CommonModule,
		SharedModule,
		ChatRoutingModule,
		StoreModule.forFeature(fromChats.CHATS_FEATURE_KEY, fromChats.reducer),
		EffectsModule.forFeature([ChatsEffects]),
		StoreModule.forFeature(fromStatus.STATUS_FEATURE_KEY, fromStatus.reducer),
		EffectsModule.forFeature([StatusEffects]),
		StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
		EffectsModule.forFeature([UsersEffects])
	],
	providers: [ChatsFacade, StatusFacade, UsersFacade]
})
export class ChatModule {}
