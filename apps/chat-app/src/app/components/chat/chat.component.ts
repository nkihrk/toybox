import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';
import { LogItemServer } from './interfaces/log-item.model';
import { User, Users } from './interfaces/user.model';
import { JoinRoom } from './interfaces/join-room.model';
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

					if (uuidValidate(roomId)) {
						this.roomId = roomId;

						this._joinRoom(joinRoom);
						this._connectToWebsocket(this.subscriptions, roomId, roomName);
					}
				},
				($error: any) => {
					console.log($error);
				}
			)
		);
	}

	private _joinRoom($joinRoom: JoinRoom): void {
		this.websocketService.emit('joinRoom', $joinRoom);
	}

	private _getUsers(): void {
		// get all users in the current room
		this.websocketService.emit('getUsers', '');
	}

	private _connectToWebsocket($subscriptions: Subscription[], $roomId: string, $roomName: string): void {
		this._getUsers();

		$subscriptions.push(
			this.websocketService.on('messageToClient').subscribe(($data: LogItemServer) => {
				console.log($data);
				this.logItems.push($data);

				//				setTimeout(() => {
				//					this.chatLogRef.nativeElement.scrollTop = this.chatLogRef.nativeElement.scrollHeight;
				//				}, 1);
			}),
			this.websocketService.on('newUserToClient').subscribe(($data: User) => {
				console.log($data);
				this.users[$data.userId] = $data;
			}),
			this.websocketService.on('getUsers').subscribe(($data: Users) => {
				console.log($data);
				this.users = $data;
			}),
			this.websocketService.on('removeUserToClient').subscribe(($data: string) => {
				console.log($data);
				delete this.users[$data];
			})
		);
	}
}
