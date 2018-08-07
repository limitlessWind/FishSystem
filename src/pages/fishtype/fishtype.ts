import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import $ from 'jquery';
import { HttpProvider } from '../../providers/http/http';
import { Varsyncer } from '../../service/Varsyncer';

/**
 * todo test delete stage fish
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fishtype',
  templateUrl: 'fishtype.html',
})
export class FishtypePage {

  url: string = "http://47.93.237.6:8080/fishsystem/getData.jsp";
  uid: string;
  role: string;
  isManager: boolean = false;
  isChangeInfo: boolean = false;
  isChangeFishInfo: boolean = false;
  fishes: any[];
  curFish: any;
  curStage = -1;
  curstageObj: any;
  curTab = 1;
  curFishStages: any[] = [];
  fishSyncer: Varsyncer;


  constructor(public navCtrl: NavController, private alert: AlertController, public navParams: NavParams, public httpProvider: HttpProvider) {
    //this.httpProvider.getFishes();
    /* this.fishSyncer = this.httpProvider.fishSyncer;
    this.fishSyncer.varname.subscribe(update => {
      this.fishes = update;
    }); */
    this.fishes = this.httpProvider.getFishes();
    
    //this.role = this.httpProvider.role;
    //if (this.role == '管理员') this.isManager = true;
    //this.isManager = true;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FishtypePage');
    //console.log('fishes length ' + this.fishes.length);
    if (this.fishes.length > 0) {
      this.chooseFish(this.fishes[0]);
    }
  }

  ionViewWillEnter() {
    this.uid = this.httpProvider.uid;
    this.role = this.httpProvider.role;
    if (this.role == '管理员') this.isManager = true;
  }

  selectFishTab(): void{
    this.curTab = 1;
  }

  selectStageTab(): void{
    this.curTab = 2;
  }

  selectInfoTab(): void{
    this.curTab = 3;
  }

  chooseFish(fish): void{
    //if (this.curFish == fish) return;
    this.isChangeInfo = false;
    let index = this.fishes.indexOf(this.curFish);
    $(".fishitem").eq(index).removeClass('selected');
    this.curFish = fish;
    index = this.fishes.indexOf(this.curFish);
    console.log('index' + index);
    $(".fishitem").eq(index).addClass('selected');
    console.log('fishname' + fish.short_name);
    this.curStage = -1;

    let self = this;
    let input ='{"fish_id":'+fish.id+'}';
    $.ajax({ 
      async:false,
      cache:false,
          type: "post", 
          url: this.url, 
          data : {
              fname:'getFishstages',
              fparam:input
          },
          beforeSend: function(xhr){
              xhr.setRequestHeader('sid', self.uid);
          },
          success: function (data) { 
              var stateResult=JSON.parse(data);
              self.curFishStages = [];
              if(stateResult.result!=null){              
                  for(var i=0;i<stateResult.result.length;i++){
                    self.curFishStages[i]=stateResult.result[i];
                  }
              } 
          }, 
          complete:function(){
               
          },
          error: function() {
              alert('请求发生错误');
          } 
      });
  }

  addFish(): void{
    let index = this.fishes.indexOf(this.curFish);
    $(".fishitem").eq(index).removeClass('selected');
    this.isChangeInfo = true;
    this.curStage = -1;
    this.selectInfoTab();
    this.curFish = {
      "id": -1,
      "short_name": "请输入鱼类名",
      "detail_name": " ",
      "min_temp": 4,
      "nitrogen_waste_a": 0.1985,
      "nitrogen_waste_b": 2.9405,
      "p_waste_a": 0.0044,
      "p_waste_b": 0.0063,
      "memo": ""
    };
  }

  removeFish(): void {
    let prompt = this.alert.create({
      title: '提示信息',
      message: '确定删除' + this.curFish.short_name + '吗?',
      cssClass: 'delete',
      buttons: [
        {
          text: '取消'
        },
        {
          text: '确认',
          handler: ()=> {
            this.deleteFish();
          }		
        }
      ]
      });
  
      prompt.present();
  }

  deleteFish(): void{
    let deleteFishInput = '{"fish_id":' + this.curFish.id + '}';
    //删除鱼类信息
    var self = this;
    $.ajax({
      async: false,
      type: "post",
      url: this.url,
      data: {
        fname: 'deletefish',
        fparam: deleteFishInput
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('sid', self.uid);
      },
      success: function (data) {
        var deleteFishResult = JSON.parse(data);
        if (deleteFishResult.success == 1) {
          alert("成功" + deleteFishResult.result.message);
          self.fishes = self.httpProvider.getFishes();
          //window.location.reload();
        }
        else {
          alert("失败" + deleteFishResult.result.reason + '...');
        }
      },
      error: function () {
        alert("网络请求错误");
      }
    });  
    this.httpProvider.getFishes();
    if (this.fishes.length!=0) {
      this.chooseFish(this.fishes[0]);
    }
  }

  chooseStage(stage): void{
    this.isChangeInfo = false;
    if (this.curstageObj == stage) return;
    if (this.curStage != -1) {
      $(".stageitem").eq(this.curStage).removeClass('selected');
    }
    let index = this.curFishStages.indexOf(stage);
    this.curStage = index;
    this.curstageObj = this.curFishStages[index];
    console.log(this.curStage);
    
    //index = this.fishes.indexOf(this.curFish);
    $(".stageitem").eq(index).addClass('selected');
  }

  addStage(): void{   
    if (this.curStage != -1) {
      $(".stageitem").eq(this.curStage).removeClass('selected');
    }
    this.curStage = this.curFishStages.length;
    this.isChangeInfo = true;
    this.selectInfoTab();
    this.curstageObj = {
			"id": -1,
			"fish_id": this.curFish.id,
			"stg_name": "自定义阶段",
			"start_wgt": '',
			"end_wgt": '',
			"stg_tgc": '',
			"exp": ''
		};
  }

  removeStage(): void {
    if (this.curStage == -1) {
      alert('请选择阶段再删除');
      return;
    }
    let prompt = this.alert.create({
      title: '提示信息',
      message: '确定删除' + this.curstageObj.stg_name + '吗?',
      cssClass: 'delete',
      buttons: [
        {
          text: '取消'
        },
        {
          text: '确认',
          handler: ()=> {
            this.deleteStage();
          }		
        }
      ]
      });
  
      prompt.present();
  }

  deleteStage(): void {
    
    let deleteStageInput = '{"fish_id":' + this.curFish.id + ',"stg_id":' + this.curstageObj.id + '}';
    let self = this;
    $.ajax({
      async: false,
      type: "post",
      url: this.url,
      data: {
        fname: 'deleteFishstage',
        fparam: deleteStageInput
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('sid', self.uid);
      },
      success: function (data) {
        var deleteFishstageResult = JSON.parse(data);
        if (deleteFishstageResult.success == 1) {
          alert('成功 ' + deleteFishstageResult.result.message);
          this.curStage = -1;
          let index = self.curFishStages.indexOf(self.curstageObj);
          if (index > -1)
            self.curFishStages.splice(index, 1);
        }
        else {
          alert('fail' + deleteFishstageResult.result.reason + '...');
        }
      },
      error: function () {
        alert("网络请求错误");
      }
    });
    
  }

  change(): void{
    this.isChangeInfo = true;
  }

  commit(): void{
    let fname = '';
    let fparam = '';
    if (this.curStage == -1) {  //fish
      if (this.curFish.id == -1) {    //add
        fname = 'addfish';
        fparam = '{"fish_name":"'+this.curFish.short_name+'"}';
      } else {
        fname = 'updatefish';
        fparam = '{"fish_id":'+this.curFish.id+',"short_name":"'+this.curFish.short_name+'","detail_name":"'+this.curFish.detail_name+'","min_temp":'+this.curFish.min_temp+',"nitrogen_waste_a":'+this.curFish.nitrogen_waste_a+',"nitrogen_waste_b":'+this.curFish.nitrogen_waste_b+',"p_waste_a":'+this.curFish.p_waste_a+',"p_waste_b":'+this.curFish.p_waste_b+',"memo":""}';
      }
    } else {    //stage
      if (this.curstageObj.id == -1) {  //add
        fname = 'addstageforfish';
        fparam = '{"fish_id":'+this.curFish.id+',"stg_name":"'+this.curstageObj.stg_name+'","start_wgt":'+this.curstageObj.start_wgt+',"end_wgt":'+this.curstageObj.end_wgt+',"stg_tgc":'+this.curstageObj.stg_tgc+',"exp":'+this.curstageObj.exp+'}';
      } else {
        fname = 'updateFishstage';
        fparam = '{"fish_id":'+this.curFish.id+',"stg_id":'+this.curstageObj.id+',"stg_name":"'+this.curstageObj.stg_name+'","stg_tgc":'+this.curstageObj.stg_tgc+',"exp":'+this.curstageObj.exp+'}';
      }
    }

    let self = this;
    $.ajax({ 
      async:false,
      type: "post", 
      url: this.url, 
      data : {
          fname: fname,
          fparam: fparam
      },
      beforeSend: function(xhr){
          xhr.setRequestHeader('sid', self.uid);
      },
      success: function (data) { 
          var changeStageResult=JSON.parse(data);
          if(changeStageResult.success==1){
              alert("成功: " + changeStageResult.result.message);
              self.fishes = self.httpProvider.getFishes();
              if (self.curStage == -1) {
                self.curTab = 1;
              } else {
                self.chooseFish(self.curFish);
                self.curTab = 2;
              }
          }
          else{
              alert('Fail:'+changeStageResult.result.reason+'...');
          }
      }, 
      error: function() {
          alert("网络请求错误");
      } 
  });
  }
}
