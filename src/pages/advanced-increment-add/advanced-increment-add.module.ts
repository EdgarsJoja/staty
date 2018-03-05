import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvancedIncrementAddPage } from './advanced-increment-add';

@NgModule({
  declarations: [
    AdvancedIncrementAddPage,
  ],
  imports: [
    IonicPageModule.forChild(AdvancedIncrementAddPage),
  ],
})
export class AdvancedIncrementAddPageModule {}
