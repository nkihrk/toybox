import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'toybox-create-room',
	templateUrl: './create-room.component.html',
	styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit, OnDestroy {
	isCreateRoom = true;
	createRoomForm: FormGroup;

	private subscriptions: Subscription[] = [];

	constructor(private builder: FormBuilder, private route: ActivatedRoute, private router: Router) {}

	ngOnInit(): void {
		this._createForm();
		this._checkQueryParams();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(($subscription: Subscription) => $subscription.unsubscribe());
	}

	private _createForm(): void {
		this.createRoomForm = this.builder.group({
			'room-name': new FormControl('', [Validators.required])
		});
	}

	private _checkQueryParams(): void {
		this.subscriptions.push(
			this.route.queryParamMap.subscribe(
				($params: ParamMap) => {
					const roomId = $params.get('id');

					if (uuidValidate(roomId)) {
						// disable room creation dialog
						this.isCreateRoom = false;
					} else {
						// Enable room creation dialog
						this.isCreateRoom = true;
					}
				},
				($error: any) => {
					console.log($error);
				},
				() => {
					console.log('done successfully');
				}
			)
		);
	}

	private _createRoom(): void {
		const roomId: string = uuidv4();
		this.router.navigate(['/room'], { queryParams: { id: roomId } });
	}
}
