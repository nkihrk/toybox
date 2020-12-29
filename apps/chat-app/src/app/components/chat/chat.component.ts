import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';
import { LogItem } from './interfaces/log-item.model';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { validate as uuidValidate } from 'uuid';

@Component({
	selector: 'toybox-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
	@ViewChild('chatLog', { static: true }) chatLogRef: ElementRef<HTMLDivElement>;

	logItems: LogItem[] = [];

	private subscriptions: Subscription[] = [];

	constructor(private route: ActivatedRoute, private router: Router, private websocketService: WebsocketService) {}

	ngOnInit(): void {
		this._checkQueryPamaras();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(($subscription) => $subscription.unsubscribe());
	}

	private _checkQueryPamaras(): void {
		this.subscriptions.push(
			this.route.queryParamMap.subscribe(
				($params: ParamMap) => {
					const roomId = $params.get('id');

					if (uuidValidate(roomId)) this._connectToWebsocket(roomId);
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

	private _connectToWebsocket($roomId: string): void {
		this.websocketService.connect();

		this.subscriptions.push(
			this.websocketService.on('broadcast').subscribe((data) => {
				console.log(data);
				this.logItems.push(data);

				setTimeout(() => {
					this.chatLogRef.nativeElement.scrollTop = this.chatLogRef.nativeElement.scrollHeight;
				}, 1);
			})
		);
	}
}
