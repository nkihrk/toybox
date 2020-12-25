import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as ChatsActions from './chats.actions';
import * as ChatsFeature from './chats.reducer';
import * as ChatsSelectors from './chats.selectors';

@Injectable()
export class ChatsFacade {
	/**
	 * Combine pieces of state using createSelector,
	 * and expose them as observables through the facade.
	 */
	loaded$ = this.store.pipe(select(ChatsSelectors.getChatsLoaded));
	allChats$ = this.store.pipe(select(ChatsSelectors.getAllChats));
	selectedChats$ = this.store.pipe(select(ChatsSelectors.getSelected));

	constructor(private store: Store) {}

	/**
	 * Use the initialization action to perform one
	 * or more tasks in your Effects.
	 */
	init() {
		this.store.dispatch(ChatsActions.init());
	}
}
