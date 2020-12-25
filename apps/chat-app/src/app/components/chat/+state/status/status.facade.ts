import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as StatusActions from './status.actions';
import * as StatusFeature from './status.reducer';
import * as StatusSelectors from './status.selectors';

@Injectable()
export class StatusFacade {
	/**
	 * Combine pieces of state using createSelector,
	 * and expose them as observables through the facade.
	 */
	loaded$ = this.store.pipe(select(StatusSelectors.getStatusLoaded));
	allStatus$ = this.store.pipe(select(StatusSelectors.getAllStatus));
	selectedStatus$ = this.store.pipe(select(StatusSelectors.getSelected));

	constructor(private store: Store) {}

	/**
	 * Use the initialization action to perform one
	 * or more tasks in your Effects.
	 */
	init() {
		this.store.dispatch(StatusActions.init());
	}
}
