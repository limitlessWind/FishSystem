import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { HttpProvider } from '../providers/http/http';
import { UserPageModule } from '../pages/user/user.module';
import { TgcPageModule } from '../pages/tgc/tgc.module';
import { FishtypePageModule } from '../pages/fishtype/fishtype.module';
import { PredictPageModule } from '../pages/predict/predict.module';
import { IngrePageModule } from '../pages/ingre/ingre.module';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

@NgModule({
  declarations: [
    MyApp,   
    TabsPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    UserPageModule,
    IngrePageModule,
    TgcPageModule,
    PredictPageModule,
    FishtypePageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Keyboard,
    HttpProvider,
    AppVersion,
    File,
    FileOpener,
    FileTransfer,
    InAppBrowser
  ]
})
export class AppModule {}
