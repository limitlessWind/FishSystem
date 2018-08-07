import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PredictDetailPage } from './predict-detail';

@NgModule({
  declarations: [
    PredictDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PredictDetailPage),
  ],
  entryComponents: [
    PredictDetailPage
  ]
})
export class PredictDetailPageModule {}
