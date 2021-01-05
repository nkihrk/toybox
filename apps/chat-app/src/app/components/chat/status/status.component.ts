import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'toybox-status',
	templateUrl: './status.component.html',
	styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
	@Input() roomName: string;

	constructor() {}

	ngOnInit(): void {}
}
