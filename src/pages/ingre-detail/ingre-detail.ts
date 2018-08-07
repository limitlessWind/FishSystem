import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import $ from 'jquery';

/**
 * Generated class for the IngreDetailPage page.
 *
 * todo  no change no commit
 */

@IonicPage()
@Component({
  selector: 'page-ingre-detail',
  templateUrl: 'ingre-detail.html',
})
export class IngreDetailPage {
  isAddIngre: boolean = false;
  ingre: any;
  changeSignal: boolean = false;  //true: 修改饲料, false: 添加饲料
  title: string;

  constructor(public navCtrl: NavController,private toast: ToastController, public navParams: NavParams, public http: HttpProvider) {
    let ingreTemp = navParams.get('ingre');
    if (ingreTemp != 'add') {
      this.ingre = ingreTemp;
      this.title = '详细信息';
      this.changeSignal = true;
    } else {
      this.isAddIngre = true;
      this.title = '添加饲料';
      //设置ingre的默认值
      this.ingre = {
        "id": 0,
        "usr_id": 0,
        "feed_name": "请输入饲料名称",
        "dm": 1,
        "cp": 2,
        "cp_contri": 2,
        "cp_coef": 0,
        "lipid": 3,
        "lipid_contri": 0,
        "lipid_coef": 0,
        "cho": 3,
        "cho_contri": 17,
        "cho_coef": 0,
        "cf": 1,
        "pi": 2,
        "ash": 2,
        "digestible_protein": 3,
        "digestible_ph": 0,
        "efw": null,
        "memo": ""
      };
    }
    //console.log("ingre" + this.ingre.feed_name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IngreDetailPage');
  }

  ionViewWillEnter() {
    console.log("will enter");
    if (!this.http.uid) {
      this.navCtrl.goToRoot({});
    }
    
  }

  change(): void {
    if (!this.http.uid) {
      //alert('请先登陆');
      this.toast.create({
        message: '请先登陆',
        duration: 1000,
        position: 'middle'
      }).present();
      //this.navCtrl.parent.select(4);
      return;
    }
    if (!this.isAddIngre) {
      this.isAddIngre = true;
    }
  }

  commit(): void {
    for (let key in this.ingre) {
      let value = this.ingre[key]
      if (key != 'feed_name') {    
        if (key == 'memo')  continue;
        if (!value && isNaN(parseFloat(value))) {
          alert(key + "非法");
          return;
        }
      } else {
        if (!value) {
          alert("名称非法");
          return;
        }       
      }
    }

    let newFeedInput = '';
    let fname = '';
    if (this.changeSignal) {
      fname = 'updatefeedinfo';
      newFeedInput = '{"feed_id":'+this.ingre.id+',"feed_name":"'+this.ingre.feed_name+'","dm":'+this.ingre.dm+',"cp":'+this.ingre.cp+',"cp_contri":'+this.ingre.cp_contri+',"cp_coef":'+this.ingre.cp_coef+',"lipid":'+this.ingre.lipid+',"lipid_contri":'+this.ingre.lipid_contri+',"lipid_coef":'+this.ingre.lipid_coef+',"cho":'+this.ingre.cho+',"cho_contri":'+this.ingre.cho_contri+',"cho_coef":'+this.ingre.cho_coef+',"cf":'+this.ingre.cf+',"pi":'+this.ingre.pi+',"ash":'+this.ingre.ash+',"digestible_protein":'+this.ingre.digestible_protein+',"digestible_ph":'+this.ingre.digestible_ph+',"efw":'+this.ingre.efw+',"memo":""}';
    } else {
      fname = 'addfeed';
      newFeedInput='{"feed_name":"'+this.ingre.feed_name+'","dm":'+this.ingre.dm+',"cp":'+this.ingre.cp+',"lipid":'+this.ingre.lipid+',"cho":'+this.ingre.cho+',"cf":'+this.ingre.cf+',"pi":'+this.ingre.pi+',"ash":'+this.ingre.ash+',"digestible_protein":'+this.ingre.digestible_protein+',"digestible_ph":'+this.ingre.digestible_ph+',"efw":'+this.ingre.efw+'}';
    }

    let self = this;
    $.ajax({
      async: false,
      type: "post",
      url: this.http.url,
      data: {
        fname: fname,
        fparam: newFeedInput
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('sid', self.http.uid);
      },
      success: function (data) {
        var addFeedResult = JSON.parse(data);
        if (addFeedResult.success == 1) {
          alert("成功");
          self.isAddIngre = false;
           if (!self.changeSignal) {
            //self.navCtrl.pop();
            self.http.getIngre();
          } 
          
        }
        else {
          alert("错误 " + addFeedResult.result.reason);
        }
      },
      error: function () {
        alert('网络错误');
      } 
    });
  }


}
