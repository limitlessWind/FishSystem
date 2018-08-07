import { Component } from '@angular/core';
import { IngrePage } from '../ingre/ingre';
import { TgcPage } from '../tgc/tgc';
import { PredictPage } from '../predict/predict';
import { FishtypePage } from '../fishtype/fishtype';
import { UserPage } from '../user/user';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = IngrePage;
  tab2Root = TgcPage;
  tab3Root = PredictPage;
  tab4Root = FishtypePage;
  tab5Root = UserPage;
  ingreParams;

  constructor() {

  }

  
  
}
