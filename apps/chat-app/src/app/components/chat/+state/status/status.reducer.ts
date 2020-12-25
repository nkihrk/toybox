import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as StatusActions from './status.actions';
import { StatusEntity } from './status.models';

export const STATUS_FEATURE_KEY = 'status';

export interface State extends EntityState<StatusEntity> {
	selectedId?: string | number; // which Status record has been selected
	loaded: boolean; // has the Status list been loaded
	error?: string | null; // last known error (if any)
}

export interface StatusPartialState {
	readonly [STATUS_FEATURE_KEY]: State;
}

export const statusAdapter: EntityAdapter<StatusEntity> = createEntityAdapter<StatusEntity>();

export const initialState: State = statusAdapter.getInitialState({
	// set initial required properties
	loaded: false
});

const statusReducer = createReducer(
	initialState,
	on(StatusActions.init, (state) => ({ ...state, loaded: false, error: null })),
	on(StatusActions.loadStatusSuccess, (state, { status }) => statusAdapter.setAll(status, { ...state, loaded: true })),
	on(StatusActions.loadStatusFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
	return statusReducer(state, action);
}
