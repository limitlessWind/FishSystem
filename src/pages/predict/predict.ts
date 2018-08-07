import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';

/**
 * Generated class for the PredictPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-predict',
  templateUrl: 'predict.html',
})
export class PredictPage {

  constructor(public navCtrl: NavController, private toast: ToastController, public navParams: NavParams, public http: HttpProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PredictPage');
  }

  go2predictDetail(type: number) {
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
    this.navCtrl.push('PredictDetailPage', {type: type});
  }
}
