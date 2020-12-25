import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as StatusFeature from './status.reducer';
import * as StatusActions from './status.actions';

@Injectable()
export class StatusEffects {
	init$ = createEffect(() =>
		this.actions$.pipe(
			ofType(StatusActions.init),
			fetch({
				run: (action) => {
					// Your custom service 'load' logic goes here. For now just return a success action...
					return StatusActions.loadStatusSuccess({ status: [] });
				},

				onError: (action, error) => {
					console.error('Error', error);
					return StatusActions.loadStatusFailure({ error });
				}
			})
		)
	);

	constructor(private actions$: Actions) {}
}
