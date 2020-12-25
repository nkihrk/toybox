import { createAction, props } from '@ngrx/store';
import { StatusEntity } from './status.models';

export const init = createAction('[Status Page] Init');

export const loadStatusSuccess = createAction('[Status/API] Load Status Success', props<{ status: StatusEntity[] }>());

export const loadStatusFailure = createAction('[Status/API] Load Status Failure', props<{ error: any }>());
