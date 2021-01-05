import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	private url = 'http://localhost:3333';
	private socket;

	constructor() {}

	connect(): void {
		this.socket = io(this.url);
	}

	emit($emitName: string, $payload: any): void {
		this.socket.emit($emitName, $payload);
	}

	on($onName: string): Observable<any> {
		const observable = new Observable((observer: any) => {
			this.socket.on($onName, ($payload: any) => {
				observer.next($payload);
			});

			return () => {
				this.socket.disconnect();
			};
		});

		return observable;
	}

	once($onName: string): Observable<any> {
		const observable = new Observable((observer: any) => {
			this.socket.once($onName, ($payload: any) => {
				observer.next($payload);
			});

			return () => {
				this.socket.disconnect();
			};
		});

		return observable;
	}
}
