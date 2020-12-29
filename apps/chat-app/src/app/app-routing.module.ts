import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions, Router, Scroll } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

const routes: Routes = [
	{ path: 'room', loadChildren: () => import('./components/chat/chat.module').then((m) => m.ChatModule) },
	{ path: '', redirectTo: '/room', pathMatch: 'full' },
	{ path: '**', redirectTo: '/room' }
];

const extraOptions: ExtraOptions = {
	initialNavigation: 'enabled',
	//enableTracing: true,
	preloadingStrategy: QuicklinkStrategy,
	scrollPositionRestoration: 'enabled',
	anchorScrolling: 'enabled',
	useHash: true
};

@NgModule({
	imports: [QuicklinkModule, RouterModule.forRoot(routes, extraOptions)],
	exports: [RouterModule]
})
export class AppRoutingModule {
	constructor(router: Router, viewportScroller: ViewportScroller) {
		router.events.pipe(filter((e) => e instanceof Scroll)).subscribe((e: Scroll) => {
			if (e.position) {
				// backward navigation
				viewportScroller.scrollToPosition(e.position);
			} else if (e.anchor) {
				// anchor navigation
				viewportScroller.scrollToAnchor(e.anchor);
			} else {
				// forward navigation
				viewportScroller.scrollToPosition([0, 0]);
			}
		});
	}
}
