import { Component, OnInit, Input } from '@angular/core';
import { LogItem } from '../interfaces/log-item.model';

@Component({
	selector: 'toybox-logs',
	templateUrl: './logs.component.html',
	styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
	@Input() logItems: LogItem[];

	constructor() {}

	ngOnInit(): void {}
}
