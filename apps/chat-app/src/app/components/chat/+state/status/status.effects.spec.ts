import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { StatusEffects } from './status.effects';
import * as StatusActions from './status.actions';

describe('StatusEffects', () => {
	let actions: Observable<any>;
	let effects: StatusEffects;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NxModule.forRoot()],
			providers: [StatusEffects, DataPersistence, provideMockActions(() => actions), provideMockStore()]
		});

		effects = TestBed.get(StatusEffects);
	});

	describe('init$', () => {
		it('should work', () => {
			actions = hot('-a-|', { a: StatusActions.init() });

			const expected = hot('-a-|', { a: StatusActions.loadStatusSuccess({ status: [] }) });

			expect(effects.init$).toBeObservable(expected);
		});
	});
});
