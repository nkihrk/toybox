import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
	selector: 'toybox-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	connection;
	data;
	message;

	constructor(private websocketService: WebsocketService) {}

	onClick() {
		this.websocketService.emit('broadcast', 'Hello!');
	}

	ngOnInit() {
		this.websocketService.connect();
		this.connection = this.websocketService.on('broadcast').subscribe((data) => {
			console.log(data);
			this.message = data;
		});
		//this.websocketService.emit('message', 'Hello!!');
	}

	ngOnDestroy() {
		this.connection.unsubscribe();
	}
}
