import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FishtypePage } from './fishtype';

@NgModule({
  declarations: [
    FishtypePage,
  ],
  imports: [
    IonicPageModule.forChild(FishtypePage),
  ],
  entryComponents: [
    FishtypePage,
  ]
})
export class FishtypePageModule {}
