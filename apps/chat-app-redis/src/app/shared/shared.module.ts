import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuicklinkModule } from 'ngx-quicklink';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [],
	imports: [CommonModule, QuicklinkModule, FlexLayoutModule, FontAwesomeModule, ReactiveFormsModule],
	exports: [CommonModule, QuicklinkModule, FlexLayoutModule, FontAwesomeModule, ReactiveFormsModule]
})
export class SharedModule {}
