import { Component, OnInit, Input } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Users } from '../interfaces/user.model';

@Component({
	selector: 'toybox-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
	@Input() users: Users;

	faChevronDown = faChevronDown;

	constructor() {}

	ngOnInit(): void {}
}
