import { StatusEntity } from './status.models';
import { State, statusAdapter, initialState } from './status.reducer';
import * as StatusSelectors from './status.selectors';

describe('Status Selectors', () => {
	const ERROR_MSG = 'No Error Available';
	const getStatusId = (it) => it['id'];
	const createStatusEntity = (id: string, name = '') =>
		({
			id,
			name: name || `name-${id}`
		} as StatusEntity);

	let state;

	beforeEach(() => {
		state = {
			status: statusAdapter.setAll(
				[createStatusEntity('PRODUCT-AAA'), createStatusEntity('PRODUCT-BBB'), createStatusEntity('PRODUCT-CCC')],
				{
					...initialState,
					selectedId: 'PRODUCT-BBB',
					error: ERROR_MSG,
					loaded: true
				}
			)
		};
	});

	describe('Status Selectors', () => {
		it('getAllStatus() should return the list of Status', () => {
			const results = StatusSelectors.getAllStatus(state);
			const selId = getStatusId(results[1]);

			expect(results.length).toBe(3);
			expect(selId).toBe('PRODUCT-BBB');
		});

		it('getSelected() should return the selected Entity', () => {
			const result = StatusSelectors.getSelected(state);
			const selId = getStatusId(result);

			expect(selId).toBe('PRODUCT-BBB');
		});

		it("getStatusLoaded() should return the current 'loaded' status", () => {
			const result = StatusSelectors.getStatusLoaded(state);

			expect(result).toBe(true);
		});

		it("getStatusError() should return the current 'error' state", () => {
			const result = StatusSelectors.getStatusError(state);

			expect(result).toBe(ERROR_MSG);
		});
	});
});
