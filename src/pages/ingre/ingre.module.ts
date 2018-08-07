import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IngrePage } from './ingre';

@NgModule({
  declarations: [
    IngrePage,
  ],
  imports: [
    IonicPageModule.forChild(IngrePage),
  ],
  entryComponents: [
    IngrePage,
  ]
})
export class IngrePageModule {}
