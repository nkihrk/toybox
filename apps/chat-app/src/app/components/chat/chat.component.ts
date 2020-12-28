import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';
import { LogItem } from './interfaces/log-item.model';

@Component({
	selector: 'toybox-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
	@ViewChild('chatLog', { static: true }) chatLogRef: ElementRef<HTMLDivElement>;

	logItems: LogItem[] = [];
	connection: Subscription;

	constructor(private websocketService: WebsocketService) {}

	ngOnInit(): void {
		this.websocketService.connect();
		this.connection = this.websocketService.on('broadcast').subscribe((data) => {
			console.log(data);
			this.logItems.push(data);

			setTimeout(() => {
				this.chatLogRef.nativeElement.scrollTop = this.chatLogRef.nativeElement.scrollHeight;
			}, 1);
		});
	}

	ngOnDestroy(): void {
		this.connection.unsubscribe();
	}
}
