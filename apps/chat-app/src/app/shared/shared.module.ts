import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuicklinkModule } from 'ngx-quicklink';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
	declarations: [],
	imports: [CommonModule, QuicklinkModule, FlexLayoutModule],
	exports: [QuicklinkModule]
})
export class SharedModule {}
