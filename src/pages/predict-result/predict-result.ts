import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import $ from 'jquery';
/**
 * Generated class for the PredictResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var require: any;
var hcharts = require('highcharts');
require('highcharts/modules/exporting')(hcharts);

@IonicPage()
@Component({
  selector: 'page-predict-result',
  templateUrl: 'predict-result.html',
})
export class PredictResultPage {

  type: number;
  title: string;
  selectedFish: any;
  fishes: any[];
  initWeight: number;
  lstTemp: number;
  avgTemp: number;
  week: number;
  tgcvalue: any;
  //nextButtonName: string;
  calculateButton: string;
  amount: number = 100;
  curStages: any[];
  stagesInfo: any[];  //s1(0g-30g):
  selectedFeeds: any[];
  ingres: any[];
  showFeedForecast: boolean = false;
  showTab: boolean = false;
  selectedTab = 1;
  theoryTGC = 1;
  //var for graph
  datas: any[]; //all
  @ViewChild('container') chartElement:any;
  @ViewChild('container1') chartElement1:any;  //container1-3 are for feed forecast
  @ViewChild('container2') chartElement2:any;
  @ViewChild('container3') chartElement3:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider) {
    this.type = navParams.get('type');
    this.title = navParams.get('title');
    this.initWeight = navParams.get('initWeight');
    this.lstTemp = navParams.get('lstTemp');
    this.avgTemp = navParams.get('avgTemp');
    this.week = navParams.get('week');
    this.selectedFish = navParams.get('selectedFish');
    this.theoryTGC = navParams.get('theoryTGC');
    //this.ingres = this.http.getIngre();

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PredictResultPage');
    this.getFishStage();
      this.selectedFeeds = new Array(this.stagesInfo.length);     
      this.ingres = this.http.getIngre();
      if (this.ingres.length == 0) {
        alert('没有饲料，请先添加');
        return;
      } else {
        /* this.selectedFeeds.forEach(element => {
          element = this.ingres[0];
          console.log(element.feed_name);
          
        }); */
        for (let i =0; i < this.selectedFeeds.length; i++) {
          this.selectedFeeds[i] = this.ingres[0];
          console.log(this.selectedFeeds[i].feed_name);
        }
      }
      //this.showFeedForecast = true;
  }

  ionViewWillEnter() {
    console.log("will enter");
    if (!this.http.uid) {
      this.navCtrl.goToRoot({});
    }
    
  }

  selectInputTab(): void {
    this.selectedTab = 1;
  }

  selectTableTab(): void {
    this.selectedTab = 2;
  }

  selectGraphTab(): void {
    this.selectedTab = 3;
  }

  calculate(): void {
    if (this.type == 1) {
      this.toFeedForecast();
    } else if(this.type == 2) {
      this.toNForecast();
    } else {
      this.toPForecast();
    }
    this.selectedTab = 2;
    this.showTab = true;
  }

  drawLineChart(container,title,y,unit,yName,datas): void {
    
    
    let  text='时间 (周)';
    hcharts.chart(container.nativeElement , {
     chart:{
       animation:{
           duration: 100,
         },
         backgroundColor: 'rgba(0,0,0,0)'
     },
     legend: {
       layout: 'horizontal',
                 align: 'center',
                 verticalAlign: 'bottom',
                 borderWidth: 0
     },
     title: {
       text: title,
       align:'center',
       style:{
       fontWeight:'bold'
         }    
     },
     tooltip: {
         valueSuffix: unit
     },
     xAxis: {
       LineColor: ' #A9A9A9',
                 lineWidth:3,				
                 allowDecimals: false,
       title: {
       text: text
       }
     },
     yAxis: {
       gridLineColor: ' #A9A9A9',
       title: {
           text: y
       },
       plotLines: [{
         value: 0,
         width: 1,
         color: ' #A9A9A9'
       }]
     },   
     series: [
         {
         name: yName,
         data: datas
         }
     ],
     credits: {
         enabled: false
     }
 });
 //$(id).highcharts();
}

 toFeedForecast(): void{
   let fishId = this.selectedFish.id;
   //获取所有数据并判断输入数据的合法性
   
   if (!this.addFeedToStages()) {
     return;
   }
   let input = '';
   if (this.theoryTGC === 1) {
     input = '{"fish_id":' + fishId + ',"init_wgt":' + this.initWeight + ',"minimum_temp":' + this.lstTemp + ',"avg_temp":' + this.avgTemp + ',"end_day":' + this.week + ',"time_unit":2}';
   }
   else {
     input = '{"fish_id":' + fishId + ',"init_wgt":' + this.initWeight + ',"minimum_temp":' + this.lstTemp + ',"avg_temp":' + this.avgTemp + ',"end_day":' + this.week + ',"time_unit":2,"theoryTGC":0}';
   }
   //ajax返回数据
   let self = this;
   //ajax返回数据
   var outputReq;
   var outputRate;
   var outputEff;
   var outputDigEnergy;
   //获取饲料预测结果
   $.ajax({
     async: false,
     type: "post",
     url: this.http.url,
     data: {
       fname: 'getfeedrequirement',
       fparam: input
     },
     beforeSend: function (xhr) {
       xhr.setRequestHeader('sid', self.http.uid);
     },
     success: function (data) {
       var predictResult = JSON.parse(data);
       if (predictResult.success == 1) {
         outputReq = predictResult.result.feed_req.split(",");
         outputRate = predictResult.result.feed_rate.split(",");
         outputEff = predictResult.result.feed_eff.split(",");
         outputDigEnergy = predictResult.result.feed_digEnergy.split(",");
       }
       else {
         alert("错误 " + predictResult.result.reason);
       }

     },
     error: function () {
       alert("error getfeedrequirement");
     }
   });
   var week = new Array();
   var reqData = new Array();
   var rateData = new Array();
   var effData = new Array();
   var digEnergyData = new Array();
   var count = 0;
   for (var x = 0; x < outputReq.length; x++) {
     count++;
     reqData[count - 1] = parseFloat((this.amount * parseFloat(outputReq[x])).toFixed(2));
     rateData[count - 1] = parseFloat(parseFloat(outputRate[x]).toFixed(2));
     effData[count - 1] = parseFloat(parseFloat(outputEff[x]).toFixed(2));
     digEnergyData[count - 1] = parseFloat(parseFloat(outputDigEnergy[x]).toFixed(2));
     week[count - 1] = count;
   }


   this.drawLineChart(this.chartElement, this.title, '饲料(克)', '克', '饲料', reqData);
   this.drawLineChart(this.chartElement1, '摄食率', '饲料摄食率(%BW/天)', '%BW/天', '摄食率', rateData);
   this.drawLineChart(this.chartElement2, '消化能', '消化能(百万焦/千克)', '百万焦/千克', '消化能', digEnergyData);
   this.drawLineChart(this.chartElement3, '饲料系数', '饲料系数(F:G)', 'F:G', '饲料系数', effData);

   week.unshift('时间(周)');
   reqData.unshift('饲料(克)');
   rateData.unshift('饲料摄食率(%BW/天)');
   digEnergyData.unshift('消化能(百万焦/千克)');
   effData.unshift('饲料系数(F:G)');
   this.datas = [];
   this.datas.push(week);
   this.datas.push(reqData);
   this.datas.push(rateData);
   this.datas.push(digEnergyData);
   this.datas.push(effData);
       
 }

 toNForecast(): void{
   let fishId = this.selectedFish.id;
   //获取所有数据并判断输入数据的合法性
   
   if (!this.addFeedToStages()) {
     return;
   }
   let input = '';
   if (this.theoryTGC === 1) {
     input = '{"fish_id":' + fishId + ',"init_wgt":' + this.initWeight + ',"minimum_temp":' + this.lstTemp + ',"avg_temp":' + this.avgTemp + ',"end_day":' + this.week + ',"time_unit":2}';
   }
   else {
     input = '{"fish_id":' + fishId + ',"init_wgt":' + this.initWeight + ',"minimum_temp":' + this.lstTemp + ',"avg_temp":' + this.avgTemp + ',"end_day":' + this.week + ',"time_unit":2,"theoryTGC":0}';
   }
   //ajax返回数据
   let self = this;
   var outputSolid;
   var outputLiquid;
   //获取N预测结果
   $.ajax({
     async: false,
     type: "post",
     url: this.http.url,
     data: {
       fname: 'getnwaste',
       fparam: input
     },
     beforeSend: function (xhr) {
       xhr.setRequestHeader('sid', self.http.uid);
     },
     success: function (data) {
       var predictResult = JSON.parse(data);
       console.log(predictResult);
       if (predictResult.success == 1) {
         outputSolid = predictResult.result.solid_n_waste.split(",");
         outputLiquid = predictResult.result.dissolved_n_waste.split(",");
       }
       else {
         alert("错误 " + predictResult.result.reason);
       }
     },
     error: function () {
       alert("error getnwaste");
     }
   });
   var week = new Array();
   var solidData = new Array();
   var liquidData = new Array();
   var totalData = new Array();
   var count = 0;
   for (var x = 0; x < outputSolid.length; x++) {
     count++;
     solidData[count - 1] = parseFloat((this.amount * parseFloat(outputSolid[x])).toFixed(2));
     liquidData[count - 1] = parseFloat((this.amount * parseFloat(outputLiquid[x])).toFixed(2));
     var temp = ((solidData[count - 1] * 1000 + liquidData[count - 1] * 1000) / 1000).toFixed(3);
     totalData[count - 1] = parseFloat(parseFloat(temp).toFixed(2));
     week[count - 1] = count;
   }

   let yName = [];
   yName.push('固态氮(克)');
   yName.push('溶解态氮(克)');
   yName.push('总氮(克)');
   var allData1 = new Array();
   allData1.push(solidData);
   allData1.push(liquidData);
   allData1.push(totalData);
   this.drawMultipleLineChart(this.chartElement, '氮排放量', '氮排放量(克)', '克', yName, allData1);

   week.unshift('时间(周)');
   solidData.unshift('固态氮排放量(克)');
   liquidData.unshift('溶解态氮排放量(克)');
   totalData.unshift('总氮排放量(克)');
   this.datas = [];
   this.datas.push(week);
   this.datas.push(solidData);
   this.datas.push(liquidData);
   this.datas.push(totalData);
 }

 toPForecast(): void{
   let fishId = this.selectedFish.id;
   //获取所有数据并判断输入数据的合法性
   
   if (!this.addFeedToStages()) {
     return;
   }
   let input = '';
   if (this.theoryTGC === 1) {
     input = '{"fish_id":' + fishId + ',"init_wgt":' + this.initWeight + ',"minimum_temp":' + this.lstTemp + ',"avg_temp":' + this.avgTemp + ',"end_day":' + this.week + ',"time_unit":2}';
   }
   else {
     input = '{"fish_id":' + fishId + ',"init_wgt":' + this.initWeight + ',"minimum_temp":' + this.lstTemp + ',"avg_temp":' + this.avgTemp + ',"end_day":' + this.week + ',"time_unit":2,"theoryTGC":0}';
   }
   //ajax返回数据
   let self = this;
   var outputSolid;
   var outputLiquid;
   //获取N预测结果
   $.ajax({
     async: false,
     type: "post",
     url: this.http.url,
     data: {
       fname: 'getpwaste',
       fparam: input
     },
     beforeSend: function (xhr) {
       xhr.setRequestHeader('sid', self.http.uid);
     },
     success: function (data) {
       var predictResult = JSON.parse(data);
       console.log(predictResult);
       if (predictResult.success == 1) {
         outputSolid = predictResult.result.solid_p_waste.split(",");
         outputLiquid = predictResult.result.dissolved_p_waste.split(",");
       }
       else {
         alert("error " + predictResult.result.reason);
       }
     },
     error: function () {
       alert("error getnwaste");
     }
   });
   var week = new Array();
   var solidData = new Array();
   var liquidData = new Array();
   var totalData = new Array();
   var count = 0;
   for (var x = 0; x < outputSolid.length; x++) {
     count++;
     solidData[count - 1] = parseFloat((this.amount * parseFloat(outputSolid[x])).toFixed(2));
     liquidData[count - 1] = parseFloat((this.amount * parseFloat(outputLiquid[x])).toFixed(2));
     var temp = ((solidData[count - 1] * 1000 + liquidData[count - 1] * 1000) / 1000).toFixed(3);
     totalData[count - 1] = parseFloat(parseFloat(temp).toFixed(2));
     week[count - 1] = count;
   }

   let yName = [];
   yName.push('固态磷(克)');
   yName.push('溶解态磷(克)');
   yName.push('总磷(克)');
   var allData1 = new Array();
   allData1.push(solidData);
   allData1.push(liquidData);
   allData1.push(totalData);
   this.drawMultipleLineChart(this.chartElement, '磷排放量', '磷排放量(克)', '克', yName, allData1);

   week.unshift('时间(周)');
   solidData.unshift('固态磷排放量(克)');
   liquidData.unshift('溶解态磷排放量(克)');
   totalData.unshift('总磷排放量(克)');
   this.datas = [];
   this.datas.push(week);
   this.datas.push(solidData);
   this.datas.push(liquidData);
   this.datas.push(totalData);
       
 }

 drawMultipleLineChart(container,title,y,unit,yName,datas): void{
     let  text='时间 (周)';
   hcharts.chart(container.nativeElement, {
           chart:{
               animation:{
                   duration: 100,
               },
               backgroundColor: 'rgba(0,0,0,0)'
           },
           legend: {
               layout: 'horizontal',
               align: 'center',
               verticalAlign: 'bottom',
               borderWidth: 0
           },
           title: {
               text: title,
               align:'center',
               style:{
               fontWeight:'bold'
               }    
           },
           tooltip: {
               valueSuffix: unit
           },
           xAxis: {
               LineColor: ' #A9A9A9',
               lineWidth:3,
               allowDecimals: false,
               title: {
               text: text
               }
           },
           yAxis: {
               gridLineColor: ' #A9A9A9',  
               title: {
                   text: y
               },
               plotLines: [{
                   value: 0,
                   width: 1,
                   color: ' #A9A9A9'
               }]
           },   
           series: [
               {
                   name: yName[0],
                   data: datas[0]
               },
               {
                   name: yName[1],
                   data: datas[1]
               },
               {
                   name: yName[2],
                   data: datas[2]
               }
           ],
           credits: {
               enabled: false
           }
   });
}

 addFeedToStages(): boolean {
   let signal=false;
       for(var i=0;i<this.curStages.length;i++){
           var stageId=this.curStages[i].id;
           var feedId=this.selectedFeeds[i].id;
           if (!feedId) {
             alert('第' + i + '阶段未选择饲料');
             return false;
           }
           signal=this.addFeedToStage(stageId,feedId);
           if(signal){
               return false;
           }
       }
   return true;
 }

 addFeedToStage(stageId,feedId):boolean {
   let signal=false;
       let input='{"stg_id":'+stageId+',"feed_id":'+feedId+'}';
       //为鱼类阶段添加饲料
       let self = this;
       $.ajax({ 
           async:false,
           type: "post", 
           url: this.http.url, 
           data : {
               fname:'updateFeedForStage',
               fparam:input
           },
           beforeSend: function(xhr){
               xhr.setRequestHeader('sid', self.http.uid);
           },
           success: function (data) { 
               var addFeedResult=JSON.parse(data);
               if(addFeedResult.success==0){
                   alert("错误 " + addFeedResult.result.reason);
                   signal=true;
               }   
           }, 
           error: function() {
             alert("error request updateFeedForStage");
           } 
       });
       return signal;
   
 }

 getFishStage(): void{
   let fishId = this.selectedFish.id;
   //stages.splice(0,stages.length);
   var input = '{"fish_id":' + fishId + '}';
   let self = this;
   $.ajax({
     async: false,
     type: "post",
     url: this.http.url,
     data: {
       fname: 'getFishstages',
       fparam: input
     },
     beforeSend: function (xhr) {
       xhr.setRequestHeader('sid', self.http.uid);
     },
     success: function (data) {
       var stageResult = JSON.parse(data);
       if (stageResult.result == null) {

         alert('当前鱼类没有对应阶段...');
         return;
         //window.location.href="index.html";
       }
       let stages = [];
       self.curStages = [];
       for (var i = 0; i < stageResult.result.length; i++) {
         stages[i] = stageResult.result[i];
       }
       self.curStages = stages;
       self.stagesInfo = [];
       for (var x = 0; x < stages.length; x++) {
         self.stagesInfo[x] = stages[x].stg_name + '(' + stages[x].start_wgt + 'g-' + stages[x].end_wgt + 'g):';
       }

     },
     error: function () {
       alert("请求阶段信息发生错误");
     }
   });
 }
}
