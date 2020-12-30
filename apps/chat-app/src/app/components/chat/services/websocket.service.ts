import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { LogItem } from '../interfaces/log-item.model';

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

	emit($emitName: string, $data: LogItem): void {
		this.socket.emit($emitName, $data);
	}

	on($onName: string): Observable<any> {
		const observable = new Observable((observer) => {
			this.socket.on($onName, ($data: any) => {
				observer.next($data);
			});

			return () => {
				this.socket.disconnect();
			};
		});

		return observable;
	}
}
