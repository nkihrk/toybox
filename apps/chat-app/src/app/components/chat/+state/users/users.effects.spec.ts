import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { UsersEffects } from './users.effects';
import * as UsersActions from './users.actions';

describe('UsersEffects', () => {
	let actions: Observable<any>;
	let effects: UsersEffects;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NxModule.forRoot()],
			providers: [UsersEffects, DataPersistence, provideMockActions(() => actions), provideMockStore()]
		});

		effects = TestBed.get(UsersEffects);
	});

	describe('init$', () => {
		it('should work', () => {
			actions = hot('-a-|', { a: UsersActions.init() });

			const expected = hot('-a-|', { a: UsersActions.loadUsersSuccess({ users: [] }) });

			expect(effects.init$).toBeObservable(expected);
		});
	});
});
