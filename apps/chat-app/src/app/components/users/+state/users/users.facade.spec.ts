import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { UsersEntity } from './users.models';
import { UsersEffects } from './users.effects';
import { UsersFacade } from './users.facade';

import * as UsersSelectors from './users.selectors';
import * as UsersActions from './users.actions';
import { USERS_FEATURE_KEY, State, initialState, reducer } from './users.reducer';

interface TestSchema {
	users: State;
}

describe('UsersFacade', () => {
	let facade: UsersFacade;
	let store: Store<TestSchema>;
	const createUsersEntity = (id: string, name = '') =>
		({
			id,
			name: name || `name-${id}`
		} as UsersEntity);

	beforeEach(() => {});

	describe('used in NgModule', () => {
		beforeEach(() => {
			@NgModule({
				imports: [StoreModule.forFeature(USERS_FEATURE_KEY, reducer), EffectsModule.forFeature([UsersEffects])],
				providers: [UsersFacade]
			})
			class CustomFeatureModule {}

			@NgModule({
				imports: [NxModule.forRoot(), StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule]
			})
			class RootModule {}
			TestBed.configureTestingModule({ imports: [RootModule] });

			store = TestBed.get(Store);
			facade = TestBed.get(UsersFacade);
		});

		/**
		 * The initially generated facade::loadAll() returns empty array
		 */
		it('loadAll() should return empty list with loaded == true', async (done) => {
			try {
				let list = await readFirst(facade.allUsers$);
				let isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(false);

				facade.init();

				list = await readFirst(facade.allUsers$);
				isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(true);

				done();
			} catch (err) {
				done.fail(err);
			}
		});

		/**
		 * Use `loadUsersSuccess` to manually update list
		 */
		it('allUsers$ should return the loaded list; and loaded flag == true', async (done) => {
			try {
				let list = await readFirst(facade.allUsers$);
				let isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(false);

				store.dispatch(
					UsersActions.loadUsersSuccess({
						users: [createUsersEntity('AAA'), createUsersEntity('BBB')]
					})
				);

				list = await readFirst(facade.allUsers$);
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
