import { createAction, props } from '@ngrx/store';
import { ChatsEntity } from './chats.models';

export const init = createAction('[Chats Page] Init');

export const loadChatsSuccess = createAction('[Chats/API] Load Chats Success', props<{ chats: ChatsEntity[] }>());

export const loadChatsFailure = createAction('[Chats/API] Load Chats Failure', props<{ error: any }>());
