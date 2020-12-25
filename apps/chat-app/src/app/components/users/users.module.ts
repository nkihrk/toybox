import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsers from './+state/users/users.reducer';
import { UsersEffects } from './+state/users/users.effects';
import { UsersFacade } from './+state/users/users.facade';

@NgModule({
	declarations: [UsersComponent],
	imports: [
		CommonModule,
		UsersRoutingModule,
		StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
		EffectsModule.forFeature([UsersEffects])
	],
	providers: [UsersFacade]
})
export class UsersModule {}
