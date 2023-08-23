import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoursComponent } from './hours.component';
import { DialogModule } from '../dialog/dialog.module';

@NgModule({
  declarations: [
    HoursComponent
  ],
  exports: [
    HoursComponent
  ],
  imports: [
    CommonModule,
    DialogModule
  ]
})
export class HoursModule { }
