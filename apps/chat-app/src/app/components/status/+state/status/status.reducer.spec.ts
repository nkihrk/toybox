import { StatusEntity } from './status.models';
import * as StatusActions from './status.actions';
import { State, initialState, reducer } from './status.reducer';

describe('Status Reducer', () => {
	const createStatusEntity = (id: string, name = '') =>
		({
			id,
			name: name || `name-${id}`
		} as StatusEntity);

	beforeEach(() => {});

	describe('valid Status actions', () => {
		it('loadStatusSuccess should return set the list of known Status', () => {
			const status = [createStatusEntity('PRODUCT-AAA'), createStatusEntity('PRODUCT-zzz')];
			const action = StatusActions.loadStatusSuccess({ status });

			const result: State = reducer(initialState, action);

			expect(result.loaded).toBe(true);
			expect(result.ids.length).toBe(2);
		});
	});

	describe('unknown action', () => {
		it('should return the previous state', () => {
			const action = {} as any;

			const result = reducer(initialState, action);

			expect(result).toBe(initialState);
		});
	});
});
