import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebsocketService } from '../../shared/services/websocket.service';
import { Subscription } from 'rxjs';
import { JoinRoom, User, Users, LogItemServer } from '@toybox/chat-app-interfaces';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { validate as uuidValidate } from 'uuid';

@Component({
	selector: 'toybox-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
	@ViewChild('chatLog', { static: true }) chatLogRef: ElementRef<HTMLDivElement>;

	logItems: LogItemServer[] = [];
	roomId = '';
	users: Users = {};
	roomName = '';

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
					const joinRoom: JoinRoom = { roomId, roomName };

					// initialize data first
					this._releaseData();

					// disconnect previous connection if exists
					if (this._isConnected()) this.websocketService.disconnect();

					if (uuidValidate(roomId)) {
						this.roomId = roomId;

						this._connectToWebsocket(roomId, roomName, joinRoom);
					}
				},
				($error) => {
					console.log($error);
				}
			)
		);
	}

	private _connectToWebsocket($roomId: string, $roomName: string, $joinRoom: JoinRoom): void {
		// connect to a websocket server
		this.websocketService.connect();

		// join a user to the specific room
		this._joinRoom($joinRoom);

		// get all users in the current room
		this._getRoomInfo();

		// get room info from a server
		this.subscriptions.push(
			this.websocketService.on('getRoomInfo').subscribe(($data: { users: Users; roomName: string }) => {
				console.log($data);
				this.users = $data.users;
				this.roomName = $data.roomName;
			})
		);

		// broadcast listeners
		this.subscriptions.push(
			this.websocketService.on('messageToClient').subscribe(($data: LogItemServer) => {
				console.log($data);
				this.logItems.push($data);

				// scroll to the bottom automatically after getting a message from some users
				setTimeout(() => {
					this.chatLogRef.nativeElement.scrollTop = this.chatLogRef.nativeElement.scrollHeight;
				}, 1);
			}),
			this.websocketService.on('newUserToClient').subscribe(($data: User) => {
				console.log($data);
				this.users[$data.userId] = $data;
			}),
			this.websocketService.on('removeUserToClient').subscribe(($data: string) => {
				console.log($data);
				delete this.users[$data];
			})
		);
	}

	private _joinRoom($joinRoom: JoinRoom): void {
		this.websocketService.emit('joinRoom', $joinRoom);
	}

	private _getRoomInfo(): void {
		this.websocketService.emit('getRoomInfo', undefined);
	}

	private _releaseData(): void {
		this.logItems = [];
		this.roomId = '';
		this.users = {};
		this.roomName = '';
	}

	private _isConnected(): boolean {
		return this.websocketService.io ? this.websocketService.io.connected : false;
	}
}
