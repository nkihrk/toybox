import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'toybox-message-input',
	templateUrl: './message-input.component.html',
	styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit {
	messageForm = new FormControl();

	constructor() {}

	ngOnInit(): void {}

	onEnter($event: any): void {
		if ($event.keyCode !== 13) return;

		const message: string = this.messageForm.value;

		// Clean up the messageForm
		this._resetMessageForm();
	}

	private _resetMessageForm(): void {
		this.messageForm.reset();
	}
}
