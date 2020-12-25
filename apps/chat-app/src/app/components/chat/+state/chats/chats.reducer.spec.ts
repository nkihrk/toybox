import { ChatsEntity } from './chats.models';
import * as ChatsActions from './chats.actions';
import { State, initialState, reducer } from './chats.reducer';

describe('Chats Reducer', () => {
	const createChatsEntity = (id: string, name = '') =>
		({
			id,
			name: name || `name-${id}`
		} as ChatsEntity);

	beforeEach(() => {});

	describe('valid Chats actions', () => {
		it('loadChatsSuccess should return set the list of known Chats', () => {
			const chats = [createChatsEntity('PRODUCT-AAA'), createChatsEntity('PRODUCT-zzz')];
			const action = ChatsActions.loadChatsSuccess({ chats });

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
