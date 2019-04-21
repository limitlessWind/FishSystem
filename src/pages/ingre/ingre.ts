import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import $ from 'jquery';
import { Varsyncer } from '../../service/Varsyncer';

/**
 * Generated class for the IngrePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ingre',
  templateUrl: 'ingre.html',
})
export class IngrePage {

  ingrelists: any[];
  varsyncer: Varsyncer;

  constructor(public navCtrl: NavController, private alert: AlertController, private toast: ToastController, public platform: Platform, public navParams: NavParams, public httpProvider: HttpProvider) {
    
    //this.ingrelists = this.navParams.get('list');
    //this.varsyncer = this.httpProvider.feedsSyncer;
    //console.log(typeof(this.varsyncer));
    //this.varsyncer.varname.subscribe(update => {
    //  this.ingrelists = update;
    //});
    this.httpProvider.getIngre();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IngrePage');
    
    /* console.log('feeds length' + this.httpProvider.feeds.length);
    this.platform.ready().then(() => {
      this.ingrelists = this.httpProvider.feeds;
      console.log('list length' + this.ingrelists.length);
    }); */
    
  }

  ionViewWillEnter() {
    console.log('ionViewwillEnter IngrePage');
    this.ingrelists = this.httpProvider.feeds;
  }

  addIngre(): void {
    if (!this.httpProvider.uid) {
      //alert('请先登陆');
      this.toast.create({
        message: '请先登陆',
        duration: 1000,
        position: 'middle'
      }).present();
      this.navCtrl.parent.select(4);
      return;
    }
    this.navCtrl.push('IngreDetailPage', {
      ingre: 'add'
    });
  }

  delete(ingre): void {
    let prompt = this.alert.create({
      title: '信息提示',
      message: '确定删除' + ingre.feed_name + '吗?',
      cssClass: 'delete',
      buttons: [
        {
          text: '取消'
        },
        {
          text: '确认',
          handler: ()=> {
            this.removeIngre(ingre);
          }		
        }
      ]
      });
  
      prompt.present();
  }

  removeIngre(ingre): void {
    //alert('将要删除');
    let index = this.ingrelists.indexOf(ingre);
    if (index != -1) {
      this.ingrelists.splice(index, 1);

      var deleteInput = '{"feed_id":' + ingre.id + '}';
      var self = this;
      //删除饲料信息
      $.ajax({
        async: false,
        type: "post",
        url: self.httpProvider.url,
        data: {
          fname: 'deletefeed',
          fparam: deleteInput
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('sid', self.httpProvider.uid);
        },
        success: function (data) {
          var deleteFeedResult = JSON.parse(data);
          if (deleteFeedResult.success == 1) {
            //swal(success, deleteFeedResult.result.message, "success");
            alert('删除成功');
          }
          else {
            alert('失败 ' + deleteFeedResult.result.reason);
          }
        },
        error: function () {
          //swal(error, errorMessage, "error");
        }
      });
    }
  }

  viewIngreDetail(ingre): void {
    if (!this.httpProvider.uid) {
      //alert('请先登陆');
      this.toast.create({
        message: '请先登陆',
        duration: 1000,
        position: 'middle'
      }).present();
      this.navCtrl.parent.select(4);
      return;
    }
    this.navCtrl.push('IngreDetailPage', {
      ingre: ingre
    });
  }
}
