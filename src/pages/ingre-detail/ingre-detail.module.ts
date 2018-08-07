import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IngreDetailPage } from './ingre-detail';

@NgModule({
  declarations: [
    IngreDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(IngreDetailPage),
  ],
  entryComponents: [
    IngreDetailPage
  ]
})
export class IngreDetailPageModule {}
