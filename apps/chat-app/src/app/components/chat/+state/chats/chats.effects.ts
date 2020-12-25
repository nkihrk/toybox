import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as ChatsFeature from './chats.reducer';
import * as ChatsActions from './chats.actions';

@Injectable()
export class ChatsEffects {
	init$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ChatsActions.init),
			fetch({
				run: (action) => {
					// Your custom service 'load' logic goes here. For now just return a success action...
					return ChatsActions.loadChatsSuccess({ chats: [] });
				},

				onError: (action, error) => {
					console.error('Error', error);
					return ChatsActions.loadChatsFailure({ error });
				}
			})
		)
	);

	constructor(private actions$: Actions) {}
}
