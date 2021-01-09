import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, NextObserver } from 'rxjs';

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	emit($emitName: string, $payload: any): void {
		this.socket.emit($emitName, $payload);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on($onName: string): Observable<any> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const observable = new Observable<any>((observer: NextObserver<any>) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.socket.on($onName, ($payload: any) => {
				observer.next($payload);
			});
		});

		return observable;
	}
}
