import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WebsocketService } from '../../../shared/services/websocket.service';
import { LogItemClient } from '@toybox/chat-app-interfaces';

@Component({
	selector: 'toybox-message-input',
	templateUrl: './message-input.component.html',
	styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit {
	@ViewChild('messageInput', { static: true }) messageInputRef: ElementRef<HTMLTextAreaElement>;

	@Input() roomId: string;

	messageForm = new FormControl();
	isShiftKey = false;

	constructor(private websocketService: WebsocketService) {}

	ngOnInit(): void {
		this._autoGrowTextZone(this.messageInputRef.nativeElement);

		// initialize the form's value
		this.messageForm.setValue('');
	}

	onKeyDown($event: KeyboardEvent): void {
		if ($event.keyCode === 13) {
		} else if ($event.keyCode == 16) {
			this.isShiftKey = true;
		}
	}

	onKeyUp($event: KeyboardEvent): void {
		//this._autoGrowTextZone($event.target);

		if ($event.keyCode === 16) this.isShiftKey = false;
		if ($event.keyCode !== 13) return;

		if (this.isShiftKey) {
		} else {
			const message: string = this.messageForm.value?.trim() || '';

			if (message === '') return;

			const logItem: LogItemClient = { message };

			// send a message to the server
			this.websocketService.emit('messageToServer', logItem);

			// Clean up the messageForm
			this._resetMessageForm();
			//this._autoGrowTextZone($event.target);
		}
	}

	private _autoGrowTextZone($elem: HTMLElement): void {
		$elem.style.height = '0px';
		$elem.style.height = $elem.scrollHeight + 'px';
	}

	private _resetMessageForm(): void {
		this.messageForm.reset();
	}
}
