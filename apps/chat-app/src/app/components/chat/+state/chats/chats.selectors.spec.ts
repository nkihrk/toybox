import { ChatsEntity } from './chats.models';
import { State, chatsAdapter, initialState } from './chats.reducer';
import * as ChatsSelectors from './chats.selectors';

describe('Chats Selectors', () => {
	const ERROR_MSG = 'No Error Available';
	const getChatsId = (it) => it['id'];
	const createChatsEntity = (id: string, name = '') =>
		({
			id,
			name: name || `name-${id}`
		} as ChatsEntity);

	let state;

	beforeEach(() => {
		state = {
			chats: chatsAdapter.setAll(
				[createChatsEntity('PRODUCT-AAA'), createChatsEntity('PRODUCT-BBB'), createChatsEntity('PRODUCT-CCC')],
				{
					...initialState,
					selectedId: 'PRODUCT-BBB',
					error: ERROR_MSG,
					loaded: true
				}
			)
		};
	});

	describe('Chats Selectors', () => {
		it('getAllChats() should return the list of Chats', () => {
			const results = ChatsSelectors.getAllChats(state);
			const selId = getChatsId(results[1]);

			expect(results.length).toBe(3);
			expect(selId).toBe('PRODUCT-BBB');
		});

		it('getSelected() should return the selected Entity', () => {
			const result = ChatsSelectors.getSelected(state);
			const selId = getChatsId(result);

			expect(selId).toBe('PRODUCT-BBB');
		});

		it("getChatsLoaded() should return the current 'loaded' status", () => {
			const result = ChatsSelectors.getChatsLoaded(state);

			expect(result).toBe(true);
		});

		it("getChatsError() should return the current 'error' state", () => {
			const result = ChatsSelectors.getChatsError(state);

			expect(result).toBe(ERROR_MSG);
		});
	});
});
