import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ChatsActions from './chats.actions';
import { ChatsEntity } from './chats.models';

export const CHATS_FEATURE_KEY = 'chats';

export interface State extends EntityState<ChatsEntity> {
	selectedId?: string | number; // which Chats record has been selected
	loaded: boolean; // has the Chats list been loaded
	error?: string | null; // last known error (if any)
}

export interface ChatsPartialState {
	readonly [CHATS_FEATURE_KEY]: State;
}

export const chatsAdapter: EntityAdapter<ChatsEntity> = createEntityAdapter<ChatsEntity>();

export const initialState: State = chatsAdapter.getInitialState({
	// set initial required properties
	loaded: false
});

const chatsReducer = createReducer(
	initialState,
	on(ChatsActions.init, (state) => ({ ...state, loaded: false, error: null })),
	on(ChatsActions.loadChatsSuccess, (state, { chats }) => chatsAdapter.setAll(chats, { ...state, loaded: true })),
	on(ChatsActions.loadChatsFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
	return chatsReducer(state, action);
}
