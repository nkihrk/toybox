import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { ChatsEntity } from './chats.models';
import { ChatsEffects } from './chats.effects';
import { ChatsFacade } from './chats.facade';

import * as ChatsSelectors from './chats.selectors';
import * as ChatsActions from './chats.actions';
import { CHATS_FEATURE_KEY, State, initialState, reducer } from './chats.reducer';

interface TestSchema {
	chats: State;
}

describe('ChatsFacade', () => {
	let facade: ChatsFacade;
	let store: Store<TestSchema>;
	const createChatsEntity = (id: string, name = '') =>
		({
			id,
			name: name || `name-${id}`
		} as ChatsEntity);

	beforeEach(() => {});

	describe('used in NgModule', () => {
		beforeEach(() => {
			@NgModule({
				imports: [StoreModule.forFeature(CHATS_FEATURE_KEY, reducer), EffectsModule.forFeature([ChatsEffects])],
				providers: [ChatsFacade]
			})
			class CustomFeatureModule {}

			@NgModule({
				imports: [NxModule.forRoot(), StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule]
			})
			class RootModule {}
			TestBed.configureTestingModule({ imports: [RootModule] });

			store = TestBed.get(Store);
			facade = TestBed.get(ChatsFacade);
		});

		/**
		 * The initially generated facade::loadAll() returns empty array
		 */
		it('loadAll() should return empty list with loaded == true', async (done) => {
			try {
				let list = await readFirst(facade.allChats$);
				let isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(false);

				facade.init();

				list = await readFirst(facade.allChats$);
				isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(true);

				done();
			} catch (err) {
				done.fail(err);
			}
		});

		/**
		 * Use `loadChatsSuccess` to manually update list
		 */
		it('allChats$ should return the loaded list; and loaded flag == true', async (done) => {
			try {
				let list = await readFirst(facade.allChats$);
				let isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(false);

				store.dispatch(
					ChatsActions.loadChatsSuccess({
						chats: [createChatsEntity('AAA'), createChatsEntity('BBB')]
					})
				);

				list = await readFirst(facade.allChats$);
				isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(2);
				expect(isLoaded).toBe(true);

				done();
			} catch (err) {
				done.fail(err);
			}
		});
	});
});
