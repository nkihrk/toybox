import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TailwindcssComponent } from './tailwindcss/tailwindcss.component';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule],
	providers: [],
	bootstrap: [AppComponent, TailwindcssComponent]
})
export class AppModule {}
