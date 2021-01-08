import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, NextObserver } from 'rxjs';
import { JoinRoom, LogItemClient, LogItemServer, Users, User } from '@toybox/chat-app-interfaces';

type On = LogItemServer | Users | User | string;

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	private url = 'http://localhost:3333';
	private socket: SocketIOClient.Socket;

	connect(): void {
		this.socket = io(this.url);
	}

	disconnect(): void {
		this.socket.disconnect();
	}

	get io(): SocketIOClient.Socket {
		return this.socket;
	}

	emit($emitName: string, $payload: JoinRoom | LogItemClient | string): void {
		this.socket.emit($emitName, $payload);
	}

	on($onName: string): Observable<On> {
		const observable = new Observable<On>((observer: NextObserver<On>) => {
			this.socket.on($onName, ($payload: On) => {
				observer.next($payload);
			});
		});

		return observable;
	}
}
