import { Component, Input } from '@angular/core';

@Component({
	selector: 'toybox-status',
	templateUrl: './status.component.html',
	styleUrls: ['./status.component.scss']
})
export class StatusComponent {
	@Input() roomName: string;
}
