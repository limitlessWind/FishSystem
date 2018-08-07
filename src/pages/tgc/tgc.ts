import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';

/**
 * Generated class for the TgcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tgc',
  templateUrl: 'tgc.html',
})
export class TgcPage {

  fishes: any[];

  constructor(public navCtrl: NavController, private toast: ToastController, public navParams: NavParams, public http: HttpProvider) {
    this.fishes = this.http.getFishes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TgcPage');
  }

  ionViewWillEnter() {
    this.fishes = this.http.fishes;
  }

  go2compute(fish): void{
    if (!this.http.uid) {
      //alert('请先登陆');
      this.toast.create({
        message: '请先登陆',
        duration: 1000,
        position: 'middle'
      }).present();
      this.navCtrl.parent.select(4);
      return;
    }
    this.navCtrl.push('ComputeTgcPage', {fish: fish});
  }
}
