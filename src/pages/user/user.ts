import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import $ from 'jquery';
import { HttpProvider } from '../../providers/http/http';
import { AboutMePage } from './about-me/about-me';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
/**
 * todo changePassword
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  url="http://47.93.237.6:8080/fishsystem/getData.jsp";
  user: any;
  role: string;
  isLogged: boolean = false;
  isInitPage = true;  //用于初始化时检查更新的变量
  private remember: boolean = false;
  private username: any;
  private password: any;
  private showProgress: boolean = false;
  private loadProgress: any;
  private sequence: number = 1;
  //aboutme = AboutMePage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
      public storage: Storage, public platform: Platform, public httpProvider: HttpProvider, private appVersion: AppVersion,
      private browser: InAppBrowser, private file: File, private transfer: FileTransfer, private opener: FileOpener) {
        //console.log('last' + this.navCtrl.last);
        
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    this.platform.ready().then(() => {
      this.storage.get('user_info').then(
        data => {
          if (data) {
            this.user = data;
            this.isLogged = true;
            this.role = this.user.identify;
            this.username = this.user.username;
            this.password = this.user.password;
            this.remember = true;
            //console.log('print ' + this.user.username);
          } else {
            this.user = {
              "user_id": ' ',
              "uid": '',
              "username": ' username',
              "identify": '普通用户',
              "tel": '',
              "password": ''
            };
            //console.log('print ' + this.user.username);
            this.role = 'none';
          }
        }
      );

      this.checkUpdate();
    });
  }

  changePassword(): void{
    let prompt = this.alertCtrl.create({
      title: '修改密码',
      //message: 'Enter the name of your new checklist below:',
      inputs: [       
        {
          name: 'password',
          placeholder: '新密码',
          type: 'password'
        },
        {
          name: 'repassword',
          placeholder: '确认新密码',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: '取消'
        },
        {
          text: '确认',
          handler: data => {
            let password = data.password;
            let repassword = data.repassword;
            if (password != repassword) {
              alert('两次输入密码不一样');
              return false;
            }
            if (repassword && password){
              this.sendChangeRequest(password);
            } else {
              alert('输入不合法');
            }
          }		
        }
      ]
      });
  
      prompt.present();
  }

  sendChangeRequest(password): void {
    let changeData = '{"password":"' + password + '"}';
    let self = this;
    $.ajax({
      type: "post",
      url: this.url,
      data: {
        fname: 'updateUserInfo',
        fparam: changeData
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('sid', self.user.uid);
      },
      success: function (data) {
        var changeResult = JSON.parse(data);
        if (changeResult.success == 1) {
          self.user.password = password;
          self.storage.set('user_info', self.user);
          alert("修改密码成功");
        }
        else {
          alert("错误 " + changeResult.result.reason);
        }
      },
      error: function () {
        alert("error updateUserInfo");
      }
    });
  }

  logout(): void {
    this.isLogged = false;
    //this.storage.remove('user_info');
    //this.storage.remove('uid');
    this.httpProvider.uid = '';
    this.httpProvider.role = '';
    this.httpProvider.getIngre();
    this.role = 'none';
    this.user = {
      "user_id": 'username',
      "uid": '',
      "username": ' username',
      "identify": '普通用户',
      "tel": '',
      "password": ''
    };
    //this.navCtrl.popToRoot();
    //console.log('len' + this.navCtrl.parent.length());
    //this.navCtrl.parent.remove(1, this.navCtrl.parent.length()-1, {});
    
  }

  signup(): void {
    //if (this.isLogged) return;
    let prompt = this.alertCtrl.create({
      title: '注册',
      //message: 'Enter the name of your new checklist below:',
      inputs: [
        {
          name: 'username',
          placeholder: '邮箱'
        },
        {
          name: 'tel',
          placeholder: '电话'
        },
        {
          name: 'password',
          placeholder: '密码',
          type: 'password'
        },
        {
          name: 'repassword',
          placeholder: '确认密码',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: '取消'
        },
        {
          text: '确认',
          handler: data => {
            let username = data.username;
            let password = data.password;
            let repassword = data.repassword;
            let tel = data.tel;
            if (password != repassword) {
              alert('两次输入密码不一样');
              return false;
            }
            if (username && password && tel){
              this.sendLogRequest(username, password, tel, false);
            } else {
              alert('输入不合法');
            }
          }		
        }
      ]
      });
  
      prompt.present();
  }

  signin(): void {

    if (this.username && this.password) {
      this.sendLogRequest(this.username, this.password, null, true);
    } else {
      alert('输入不合法');
    }

  }

  doremember() {
    this.remember = !this.remember;
  }

  aboutme() {
    //console.log('len' + this.navCtrl.length);
    this.navCtrl.push(AboutMePage);
  }
  
  //state   true: signin  false: signup
  sendLogRequest(username, password, tel, state: boolean): void{
    let fname = '';
    let fparam = '';
    if(state) {
      fname = 'getuserinfo';
      fparam = '{"email":"'+username+'","password":"'+password+'"}';
    } else{
      fname = 'registeruserinfo';
      fparam = '{"email":"'+username+'","password":"'+password+'","tel":"'+tel+'"}';
    }

    let self = this;
    $.ajax({
      type: "post",
      url: this.url,
      data: {
        fname: fname,
        fparam: fparam
      },
      success: function (data) {
        var loginResult = JSON.parse(data);
        if (loginResult.success == 1) {
          if (!state) {
            alert('注册成功');
            return;
          }
          var uid = loginResult.result.uid;
          var usr_id = loginResult.result.usr_id;
          var tel = loginResult.result.tel;
          //判断是否以管理员身份  0:普通用户 1:管理员
          var identify = loginResult.result.isAdmin;         
          self.role = identify == 0 ? '普通用户': '管理员';
          console.log(self.role + " " + identify);         
          self.isLogged = true;
          self.user = {
            "user_id": usr_id,
            "uid": uid,
            "username": username,
            "identity": self.role,
            "tel": tel,
            "password": password
          };
          if (self.remember) {          
            self.storage.set('user_info', self.user);
          }
          self.httpProvider.uid = self.user.uid;
          self.httpProvider.role = self.user.identity;
          self.httpProvider.user_id = self.user.user_id;
          self.httpProvider.getIngre();
          //self.storage.set('uid', uid);

        }
        else {
          alert('错误 ' + loginResult.result.reason);
        }
      },
      error: function () {
        alert("网络请求发生错误");
      }
    }); 
  }

  checkUpdate(): void {
    let self = this;
    let fparam;
    if (this.platform.is('ios')) {
      fparam = '{"platform_id":1}';
    } else {
      fparam = '{"platform_id":0}';
    }
    this.appVersion.getVersionNumber().then(curVersion => {
      $.ajax({
        async: false,
        type: "post",
        url: this.url,
        data: {
          fname: "getVersion",
          fparam: fparam
        },
        success: function (data) {
          var fishResult = JSON.parse(data);
          if (fishResult.success == 1) {
            let version = fishResult.result.version_num;
            let address = fishResult.result.file_name;
            self.checkVersion(curVersion, version, address);
          } else {
            alert("错误 " + fishResult.result.message);
          }
        },
        error: function () {
          alert("error getVersion");
        }
      });
    }).catch(e => console.log(e));
  }

  checkVersion(curVersion, reqVersion, file_name) {
    let alertmsg = '当前版本是' + curVersion;
    if (curVersion == reqVersion) {
      if (this.isInitPage) {
        this.isInitPage = false;
        return;
      }
      alertmsg += ', 已经是最新版本。';
      let alert = this.alertCtrl.create({
        title: '版本更新',
        subTitle: alertmsg,
        buttons: ['确定']
      });
      alert.present();
    } else {
      alertmsg += ', 最新版本是' + reqVersion + '。是否进行更新?';
      let alert1 = this.alertCtrl.create({
        title: '版本更新',
        message: alertmsg,
        buttons: [
          {
            text: '否',
          },
          {
            text: '是',
            handler: () => {
              console.log('更新APP');
              if (this.platform.is('ios')) {
                console.log('打开iOS下载地址----------------------------');
                this.browser.create(file_name, '_system');
                return;
                //window.location.href = 'itms-services://?action=download-manifest&url=' + url;
              } else {
                this.showProgress = true;
                console.log('开始下载Android代码----------------------------');
                const fileTransfer: FileTransferObject = this.transfer.create();
                fileTransfer.onProgress(progressEvent => {
                  this.loadProgress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                  console.log('当前进度为：' + this.loadProgress);
                });

                const savePath = this.file.externalRootDirectory + `android_${this.getSequence()}.apk`;
                fileTransfer.download(file_name, savePath).then((entry) => {
                  //console.log('保存apk包的地址为: ' + this.Share.savePath + 'Ceshiname.apk');
                  console.log('download complete: ' + entry.toURL());
                  console.log("下载成功");
                  this.showProgress = false;
                  this.opener.open(entry.toURL(), "application/vnd.android.package-archive")
                    .then(() => console.log('打开apk包成功！'))
                    .catch(e => {
                      alert('打开apk包失败');
                      console.log('打开apk包失败！', e);
                    });

                }, (error) => {
                  console.log("下载失败");
                  this.showProgress = false;
                  //this.loadingService.presentTip('操作提醒', '由于部分手机出现异常,请您进入手机设置-应用管理-Ceshiname-权限，将存储权限打开后再进行升级，由此给您带来的不便，敬请谅解。');
                  /* for(var item in error) {
                    console.log(item + ":" + error[item]);
                  } */
                  this.alertCtrl.create({
                    title: '前往网页下载',
                    subTitle: '本地升级失败',
                    buttons: [
                      {
                        text: '确定',
                        handler: () => {
                          this.browser.create(file_name, '_system');//打开网页下载
                        }
                      }
                    ]
                  }).present();

                });
              }
            }
          }
        ]
      });
      alert1.present();
    }
  }

  getSequence(): number {
    return this.sequence++;
  }
}
