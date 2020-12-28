import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'toybox-message-input',
	templateUrl: './message-input.component.html',
	styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit {
	@ViewChild('messageInput', { static: true }) messageInputRef: ElementRef<HTMLTextAreaElement>;

	messageForm = new FormControl();
	isShiftKey = false;

	constructor() {}

	ngOnInit(): void {
		this._autoGrowTextZone(this.messageInputRef.nativeElement);
	}

	onKeyUp($event: any): void {
		this._autoGrowTextZone($event.target);

		if ($event.keyCode === 16) this.isShiftKey = false;
		if ($event.keyCode !== 13) return;

		if (this.isShiftKey) {
		} else {
			const message: string = this.messageForm.value;

			// Clean up the messageForm
			this._resetMessageForm();
			this._autoGrowTextZone($event.target);
		}
	}

	private _autoGrowTextZone($elem: HTMLElement): void {
		$elem.style.height = '0px';
		$elem.style.height = $elem.scrollHeight + 'px';
	}

	private _resetMessageForm(): void {
		this.messageForm.reset();
	}

	onKeyDown($event: any): void {
		if ($event.keyCode === 13) {
		} else if ($event.keyCode == 16) {
			this.isShiftKey = true;
		}
	}
}
