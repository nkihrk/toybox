import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { WebsocketService } from '../../../shared/services/websocket.service';

@Component({
	selector: 'toybox-create-room',
	templateUrl: './create-room.component.html',
	styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit, OnDestroy {
	isCreateRoom = true;
	createRoomForm: FormGroup;
	isShowErrors = false;
	isButtonEnabled = true;

	private subscriptions: Subscription[] = [];

	constructor(
		private builder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private websocketService: WebsocketService
	) {}

	ngOnInit(): void {
		this._createForm();
		this._checkQueryParams();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(($subscription: Subscription) => $subscription.unsubscribe());
	}

	get roomNameControl(): AbstractControl {
		return this.createRoomForm.get('roomName');
	}

	createRoom(): void {
		if (this.createRoomForm.invalid) {
			this.isShowErrors = true;
			return;
		}

		// prevent multi-clicking
		this.isButtonEnabled = false;

		const roomId: string = uuidv4();
		const roomName: string = this.createRoomForm.get('roomName').value;

		this.router.navigate(['/room'], { queryParams: { id: roomId, name: roomName } }).then(
			() => {
				this._resetFlags();

				// reset form
				this.createRoomForm.get('roomName').setValue('');
			},
			($error: any) => {
				this._resetFlags();
			}
		);
	}

	private _resetFlags(): void {
		this.isButtonEnabled = true;
		this.isShowErrors = false;
	}

	private _createForm(): void {
		this.createRoomForm = this.builder.group({
			roomName: new FormControl('', [Validators.required])
		});
	}

	private _checkQueryParams(): void {
		this.subscriptions.push(
			this.route.queryParamMap.subscribe(
				($params: ParamMap) => {
					const roomId: string = $params.get('id');

					if (uuidValidate(roomId)) {
						// disable room creation dialog
						this.isCreateRoom = false;
					} else {
						// Enable room creation dialog
						this.isCreateRoom = true;
					}
				},
				($error: any) => {
					this.isCreateRoom = true;
				}
			)
		);
	}
}
