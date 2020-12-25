import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { ChatsEffects } from './chats.effects';
import * as ChatsActions from './chats.actions';

describe('ChatsEffects', () => {
	let actions: Observable<any>;
	let effects: ChatsEffects;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NxModule.forRoot()],
			providers: [ChatsEffects, DataPersistence, provideMockActions(() => actions), provideMockStore()]
		});

		effects = TestBed.get(ChatsEffects);
	});

	describe('init$', () => {
		it('should work', () => {
			actions = hot('-a-|', { a: ChatsActions.init() });

			const expected = hot('-a-|', { a: ChatsActions.loadChatsSuccess({ chats: [] }) });

			expect(effects.init$).toBeObservable(expected);
		});
	});
});
