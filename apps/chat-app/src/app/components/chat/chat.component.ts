import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'toybox-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
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
