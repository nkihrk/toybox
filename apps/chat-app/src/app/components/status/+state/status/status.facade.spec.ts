import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { StatusEntity } from './status.models';
import { StatusEffects } from './status.effects';
import { StatusFacade } from './status.facade';

import * as StatusSelectors from './status.selectors';
import * as StatusActions from './status.actions';
import { STATUS_FEATURE_KEY, State, initialState, reducer } from './status.reducer';

interface TestSchema {
	status: State;
}

describe('StatusFacade', () => {
	let facade: StatusFacade;
	let store: Store<TestSchema>;
	const createStatusEntity = (id: string, name = '') =>
		({
			id,
			name: name || `name-${id}`
		} as StatusEntity);

	beforeEach(() => {});

	describe('used in NgModule', () => {
		beforeEach(() => {
			@NgModule({
				imports: [StoreModule.forFeature(STATUS_FEATURE_KEY, reducer), EffectsModule.forFeature([StatusEffects])],
				providers: [StatusFacade]
			})
			class CustomFeatureModule {}

			@NgModule({
				imports: [NxModule.forRoot(), StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule]
			})
			class RootModule {}
			TestBed.configureTestingModule({ imports: [RootModule] });

			store = TestBed.get(Store);
			facade = TestBed.get(StatusFacade);
		});

		/**
		 * The initially generated facade::loadAll() returns empty array
		 */
		it('loadAll() should return empty list with loaded == true', async (done) => {
			try {
				let list = await readFirst(facade.allStatus$);
				let isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(false);

				facade.init();

				list = await readFirst(facade.allStatus$);
				isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(true);

				done();
			} catch (err) {
				done.fail(err);
			}
		});

		/**
		 * Use `loadStatusSuccess` to manually update list
		 */
		it('allStatus$ should return the loaded list; and loaded flag == true', async (done) => {
			try {
				let list = await readFirst(facade.allStatus$);
				let isLoaded = await readFirst(facade.loaded$);

				expect(list.length).toBe(0);
				expect(isLoaded).toBe(false);

				store.dispatch(
					StatusActions.loadStatusSuccess({
						status: [createStatusEntity('AAA'), createStatusEntity('BBB')]
					})
				);

				list = await readFirst(facade.allStatus$);
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
