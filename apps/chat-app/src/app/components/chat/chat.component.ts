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
		this._checkQueryParams();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(($subscription) => $subscription.unsubscribe());
	}

	private _checkQueryParams(): void {
		this.subscriptions.push(
			this.route.queryParamMap.subscribe(
				($params: ParamMap) => {
					const roomId: string = $params.get('id');
					const roomName: string = $params.get('name') || 'ChatApp room';

					if (uuidValidate(roomId)) this._connectToWebsocket(roomId, roomName);
				},
				($error: any) => {
					console.log($error);
				}
			)
		);
	}

	private _connectToWebsocket($roomId: string, $roomName: string): void {
		this.websocketService.connect();

		this.subscriptions.push(
			this.websocketService.on('broadcast').subscribe(($data: LogItem) => {
				console.log($data);
				this.logItems.push($data);

				setTimeout(() => {
					this.chatLogRef.nativeElement.scrollTop = this.chatLogRef.nativeElement.scrollHeight;
				}, 1);
			})
		);
	}
}
