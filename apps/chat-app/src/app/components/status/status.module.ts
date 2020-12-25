import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusRoutingModule } from './status-routing.module';
import { StatusComponent } from './status.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromStatus from './+state/status/status.reducer';
import { StatusEffects } from './+state/status/status.effects';
import { StatusFacade } from './+state/status/status.facade';

@NgModule({
	declarations: [StatusComponent],
	imports: [
		CommonModule,
		StatusRoutingModule,
		StoreModule.forFeature(fromStatus.STATUS_FEATURE_KEY, fromStatus.reducer),
		EffectsModule.forFeature([StatusEffects])
	],
	providers: [StatusFacade]
})
export class StatusModule {}
