import { Component, OnInit, Input } from '@angular/core';
import { faChevronDown, faPaw } from '@fortawesome/free-solid-svg-icons';
import { Users } from '@toybox/api-interfaces';

@Component({
	selector: 'toybox-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
	@Input() users: Users;

	faChevronDown = faChevronDown;
	faPaw = faPaw;

	constructor() {}

	ngOnInit(): void {}
}
