import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CHATS_FEATURE_KEY, State, ChatsPartialState, chatsAdapter } from './chats.reducer';

// Lookup the 'Chats' feature state managed by NgRx
export const getChatsState = createFeatureSelector<ChatsPartialState, State>(CHATS_FEATURE_KEY);

const { selectAll, selectEntities } = chatsAdapter.getSelectors();

export const getChatsLoaded = createSelector(getChatsState, (state: State) => state.loaded);

export const getChatsError = createSelector(getChatsState, (state: State) => state.error);

export const getAllChats = createSelector(getChatsState, (state: State) => selectAll(state));

export const getChatsEntities = createSelector(getChatsState, (state: State) => selectEntities(state));

export const getSelectedId = createSelector(getChatsState, (state: State) => state.selectedId);

export const getSelected = createSelector(
	getChatsEntities,
	getSelectedId,
	(entities, selectedId) => selectedId && entities[selectedId]
);
