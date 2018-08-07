import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TgcPage } from './tgc';

@NgModule({
  declarations: [
    TgcPage,
    //ComputeTgcPage
  ],
  imports: [
    IonicPageModule.forChild(TgcPage),
  ],
  entryComponents: [
    TgcPage,
    //ComputeTgcPage
  ]
})
export class TgcPageModule {}
