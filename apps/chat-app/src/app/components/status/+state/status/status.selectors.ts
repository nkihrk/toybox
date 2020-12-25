import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STATUS_FEATURE_KEY, State, StatusPartialState, statusAdapter } from './status.reducer';

// Lookup the 'Status' feature state managed by NgRx
export const getStatusState = createFeatureSelector<StatusPartialState, State>(STATUS_FEATURE_KEY);

const { selectAll, selectEntities } = statusAdapter.getSelectors();

export const getStatusLoaded = createSelector(getStatusState, (state: State) => state.loaded);

export const getStatusError = createSelector(getStatusState, (state: State) => state.error);

export const getAllStatus = createSelector(getStatusState, (state: State) => selectAll(state));

export const getStatusEntities = createSelector(getStatusState, (state: State) => selectEntities(state));

export const getSelectedId = createSelector(getStatusState, (state: State) => state.selectedId);

export const getSelected = createSelector(
	getStatusEntities,
	getSelectedId,
	(entities, selectedId) => selectedId && entities[selectedId]
);
