import { Component, Input } from '@angular/core';
import { faChevronDown, faPaw } from '@fortawesome/free-solid-svg-icons';
import { Users } from '@toybox/chat-app-interfaces';

@Component({
	selector: 'toybox-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent {
	@Input() users: Users;

	faChevronDown = faChevronDown;
	faPaw = faPaw;
}
