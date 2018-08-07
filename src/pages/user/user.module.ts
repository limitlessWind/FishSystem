import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPage } from './user'; 
import { AboutMePage } from './about-me/about-me';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UserPage,
    AboutMePage,
   
  ],
  imports: [
    IonicPageModule.forChild(UserPage),
    ComponentsModule
  ],
  entryComponents: [
    UserPage,
    AboutMePage
  ]
  
})
export class UserPageModule {}
