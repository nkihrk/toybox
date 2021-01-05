import { Component, OnInit, Input } from '@angular/core';
import { LogItemServer } from '../../../shared/interfaces/log-item.model';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'toybox-logs',
	templateUrl: './logs.component.html',
	styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
	@Input() logItems: LogItemServer[];

	faPaw = faPaw;

	constructor() {}

	ngOnInit(): void {}
}
