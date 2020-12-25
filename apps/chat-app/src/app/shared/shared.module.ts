import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuicklinkModule } from 'ngx-quicklink';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
	declarations: [],
	imports: [CommonModule, QuicklinkModule, FlexLayoutModule, FontAwesomeModule],
	exports: [QuicklinkModule]
})
export class SharedModule {}
