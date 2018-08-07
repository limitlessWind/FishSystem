import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import $ from 'jquery';
import { HttpProvider } from '../../providers/http/http';

/**
 * Generated class for the ComputeTgcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-compute-tgc',
  templateUrl: 'compute-tgc.html',
})
export class ComputeTgcPage {

  fish: any;
  interval: number = 1;
  rowcounter: number = 1;
  uid: string;
  url: string;
  user_id: string;
  dateData = [];
  lowestTData = [];
  weightData = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, private toast: ToastController) {
    this.fish = navParams.get('fish');
    this.uid = this.http.uid;
    this.url = this.http.url;
    this.user_id = this.http.user_id;
    console.log(this.user_id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComputeTgcPage');
    this.getHistoryData();
  }

  ionViewWillEnter() {
    console.log("will enter");
    if (!this.http.uid) {
      this.navCtrl.goToRoot({});
    }
    
  }

  getHistoryData(): void{
    var input = '{"fish_id":' + this.fish.id + ',"usr_id":' + this.user_id + '}';
    let time_unit;
    /* let dateData = [];
    let lowestTData = [];
    let weightData = []; */
    let self = this;
    $.ajax({
      async: false,
      type: "post",
      url: this.url,
      data: {
        fname: 'getHistoricalData',
        fparam: input
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('sid', self.uid);
      },
      success: function (data) {
        console.log(data);
        
        let historyDataResult = JSON.parse(data);
        if (historyDataResult.success == 1) {
          if (historyDataResult.result != null) {
            let result = historyDataResult.result;
            time_unit = result.time_unit;
            var len = result.day_seq.length;
            console.log("len " + len);
            
            for (var i = 0; i < len; i++) {
              self.dateData.push(result.day_seq[i]);
              self.lowestTData.push(result.avg_temp[i]);
              self.weightData.push(result.body_wgt[i]);
              
            }
          }
        } else {
          alert("错误 " + historyDataResult.result.reason);
        }
      },
      error: function () {
        alert("请求历史数据错误");       
      }
    });
    this.rowcounter = this.dateData.length;
    if (this.rowcounter == 0) {
      self.dateData.push(1);
      self.lowestTData.push(10);
      self.weightData.push(0.6);
      this.rowcounter++;
    }
    //根据排序重新给表格赋值
    /* $('td:nth-of-type(3n+1)').each(function (index, data) {
      console.log(dateData[index]);
      $(data).children().val(dateData[index]);
    });
    $('td:nth-of-type(3n+2)').each(function (index, data) {
      console.log(lowestTData[index]);
      $(data).children().val(lowestTData[index]);
    });
    $('td:nth-of-type(3n+3)').each(function (index, data) {
      $(data).children().val(weightData[index]);
    }); */
    //设置时间间隔
    if (time_unit) {
      this.interval = time_unit;
    } 
  }

  sort(): boolean {
    let emptySignal = false;
    //获取表格数据
    for (let index in this.dateData) {
      if (!this.dateData[index]) {
        alert('第' + (+index + 1) + '行的时间输入为空...');
        return false;
      } else if (this.dateData[index] < 0){
        alert('第' + (+index + 1) + '行的时间输入非法...');
        return false;
      } else if (this.dateData[index] != parseInt(this.dateData[index])) {
        alert('第' + (+index + 1) + '行的时间输入不能为小数...');
        return false;
      }
    }
    for (let index in this.lowestTData) {
      if (!this.lowestTData[index]) {
        alert('第' + (+index + 1) + '行的温度输入为空...');
        return false;
      }
    }
    for (let index in this.weightData) {
      if (!this.weightData[index]) {
        alert('第' + (+index + 1) + '行的体重输入为空...');
        return false;
      } else if (this.weightData[index] < 0){
        alert('第' + (+index + 1) + '行的体重输入非法...');
        return false;
      }
    }/* 
    $('td:nth-of-type(3n+1)').each(function (index, data) {
      let Data = $(data).children().val() + '';
      let dateData = parseInt(Data);
      let dateData1 = parseFloat(Data);
      if (!Data.trim()) {
        alert('第' + (index + 1) + '行的时间输入为空...');
        return false;
      }
      else if (isNaN(Number(Data))) {
        alert('第' + (index + 1) + '行的时间输入非法...');
        return false;
      }
      else if (dateData != dateData1) {
        alert('第' + (index + 1) + '行的时间输入不能为小数...');
        return false;
      }
      dateArray.push(dateData);
    });
    $('td:nth-of-type(3n+2)').each(function (index, data) {
      var Data = $(data).children().val() + '';
      var temData = parseFloat(Data);
      if (!Data.trim()) {
        alert('第' + (index + 1) + '行的平均温度输入为空...');
        return false;
      }
      else if (isNaN(Number(Data))) {
        alert('第' + (index + 1) + '行的平均温度输入非法...');
        return false;
      }
      lowestTArray.push(temData);
    });
    $('td:nth-of-type(3n+3)').each(function (index, data) {
      var Data = $(data).children().val() + '';
      var weightData = parseFloat(Data);
      if (!Data.trim()) {
        alert('第' + (index + 1) + '行的采样体重输入为空...');
        return false;
      }
      else if (isNaN(Number(Data))) {
        alert('第' + (index + 1) + '行的采样体重输入非法...');
        return false;
      }
      weightArray.push(weightData);
    }); */

    //排序模块
    let len = this.dateData.length;
    let errorRow;
    //判断是否有重复时间数据
    for (var x = 0; x < len; x++) {
      for (var y = x + 1; y < len; y++) {
        if (this.dateData[x] == this.dateData[y]) {
          emptySignal = true;
          errorRow = y;
          break;
        }
      }
      if (emptySignal) {
        alert('第' + (x + 1) + '行和第' + (errorRow + 1) + '行的时间输入重复为非法...');
        break;
      }
    }
    if (emptySignal) {
      return false;
    }
    //冒泡排序三个数组
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (this.dateData[j] > this.dateData[j + 1]) {
          //时间数组
          var temp1 = this.dateData[j + 1];
          this.dateData[j + 1] = this.dateData[j];
          this.dateData[j] = temp1;
          //最低温度数组
          var temp2 = this.lowestTData[j + 1];
          this.lowestTData[j + 1] = this.lowestTData[j];
          this.lowestTData[j] = temp2;
          //采样体重数组
          var temp3 = this.weightData[j + 1];
          this.weightData[j + 1] = this.weightData[j];
          this.weightData[j] = temp3;
        }
      }
    }
    //根据排序重新给表格赋值
    /* $('td:nth-of-type(3n+1)').each(function(index,data){
      $(data).children().val(dateArray[index]);
    });
    $('td:nth-of-type(3n+2)').each(function(index,data){
      $(data).children().val(lowestTArray[index]);
    });
    $('td:nth-of-type(3n+3)').each(function(index,data){
      $(data).children().val(weightArray[index]);
    }); */

    return true;
  }

  addRow(): void{
    /* let dateInput='<td class="info"><ion-input type="text" class="inputStyle" value="'+(++this.rowcounter)+'" ></ion-input></td>';
		let textInput='<td class="info"><ion-input type="text" class="inputStyle" ></ion-input></td>';
    let htmlContent='<tr>'+dateInput+textInput+textInput+'</tr>';
    $('table').append(htmlContent); */
    console.log("add one row");
    this.dateData.push(++this.rowcounter);
    this.lowestTData.push(null);
    this.weightData.push(null);
    //this.rowcounter++;
  }

  decRow(): void{
    if(this.rowcounter > 2){
      this.rowcounter--;
      //$('table tr:last-of-type').remove();
      this.dateData.pop();
      this.lowestTData.pop();
      this.weightData.pop();
   } else {
    this.toast.create({
      message: '至少输入两行数据',
      duration: 1000,
      position: 'middle'
    }).present();
   }
  }

  reset(): void{
    while (this.rowcounter > 2) {
      this.decRow();
    }
    
  }

  compute(): void{
    if (this.rowcounter < 2) {
      alert('输入数据至少两行');
      return;
    }
    if (!this.sort()) return;
    let date='';
        //采样平均温度数据
		let averageT='';
		//采样体重数据
    let getWeight='';
    for (let index in this.dateData) {
      if (index == '0') {
        date += this.dateData[index];
      } else {
        date += ',' + this.dateData[index];
      }
    }
    for (let index in this.lowestTData) {
      if (index == '0') {
        averageT += this.lowestTData[index];
      } else {
        averageT += ',' + this.lowestTData[index];
      }
    }
    for (let index in this.weightData) {
      if (index == '0') {
        getWeight += this.weightData[index];
      } else {
        getWeight += ',' + this.weightData[index];
      }
    }
    /* $('td:nth-of-type(3n+1)').each(function (index, data) {     
      let Data = $(data).children().val() + '';
      let tempdata = parseInt(Data);
      if (index == 0) {
        date += tempdata;
      } else {
        date += ',' + tempdata;
      }
    });
    $('td:nth-of-type(3n+2)').each(function (index, data) {
      let Data = $(data).children().val() + '';
      let tempdata = parseFloat(Data);
      if (index == 0) {
        averageT += tempdata;
      }
      else {
        averageT += ',' + tempdata;
      }
    });
    $('td:nth-of-type(3n+3)').each(function (index, data) {
      let Data = $(data).children().val() + '';
      let tempdata = parseFloat(Data);
      if (index == 0) {
        getWeight += tempdata;
      }
      else {
        getWeight += ',' + tempdata;
      }
    }); */
    //采样数据输入
    var dataInput = '{"fish_id":' + this.fish.id + ',"time_unit":' + this.interval + ',"day_seq_data":"' + date + '","body_wgt_data":"' + getWeight + '","avg_temp_data":"' + averageT + '"}';
    //增加采样值
    let self = this;
    let emptySignal = false;
    $.ajax({
      async: false,
      type: "post",
      url: this.url,
      data: {
        fname: 'addPrivateHistoricalData',
        fparam: dataInput
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('sid', self.uid);
      },
      success: function (data) {
        var addDataResult = JSON.parse(data);
        if (addDataResult.success == 0) {
          emptySignal = true;
          alert("错误 " + addDataResult.result.reason);
        }
      },
      error: function () {
        alert("网络请求错误");
      }
    });
    if (emptySignal) {
      return;
    }
    var updateInput = '{"fish_id":' + this.fish.id + '}';
    //计算更新副本鱼类的TGC
    $.ajax({
      async: false,
      type: "post",
      url: this.url,
      data: {
        fname: 'updateUserTGC',
        fparam: updateInput
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('sid', self.uid);
      },
      success: function (data) {
        var updateResult = JSON.parse(data);
        if (updateResult.success == 1) {
          alert('TGC值设置成功');
          //window.location.href = "index.html";
        }
        else {
          alert("错误 " + updateResult.result.reason);
        }
      },
      error: function () {
        alert("网络请求错误");
      }
    }); 
  }
}
