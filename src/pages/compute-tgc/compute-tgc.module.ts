import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComputeTgcPage } from './compute-tgc';

@NgModule({
  declarations: [
    ComputeTgcPage,
  ],
  imports: [
    IonicPageModule.forChild(ComputeTgcPage),
  ],
  entryComponents: [
    //ComputeTgcPage
  ]
})
export class ComputeTgcPageModule {}
