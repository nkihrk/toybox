import { Component, Input } from '@angular/core';
import { LogItemServer } from '@toybox/chat-app-interfaces';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'toybox-logs',
	templateUrl: './logs.component.html',
	styleUrls: ['./logs.component.scss']
})
export class LogsComponent {
	@Input() logItems: LogItemServer[];

	faPaw = faPaw;
}
