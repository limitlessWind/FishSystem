//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import $ from 'jquery';
import { Storage } from '@ionic/storage';
//import { Varsyncer } from '../../service/Varsyncer';
/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {
    url: string = "http://47.93.237.6:8080/fishsystem/getData.jsp";
    feeds: any[] = [];
    fishes: any[] = [];
    uid: string;
    role: string;
    feedsSyncer: any;
    //fishSyncer: Varsyncer;
    user_id: string;

  constructor(private storage: Storage) {
    console.log('Hello HttpProvider Provider');
    
    //this.fishSyncer = new Varsyncer();
    //this.feedsSyncer = new Varsyncer();
    this.getUid();
    this.getFishes();
   
    
  }


  getUid(): void {
    console.log('getUid');
    this.storage.get("user_info").then((result) => {
        if (result){
            this.uid = result.uid;
            this.role = result.identity;
            this.user_id = result.user_id;
            console.log("uid: " + this.uid);
        }
        //this.getIngre();
    });
  }

  getIngre(): any[] {
    var self = this;
    //if (!self.uid) return;
    $.ajax({ 
    	async:false,
        type: "post", 
        url: this.url, 
        data : {
        	fname:'getfeeds',
        },
        beforeSend: function(xhr){
            if (self.uid) {
                xhr.setRequestHeader('sid', self.uid);
            }
        },
        success: function (data) { 
            console.log("data" + data);
            var feedResult=JSON.parse(data);
            if(feedResult.success==1){
                self.feeds = [];
            	for(var i=0;i<feedResult.result.length;i++){
            	    self.feeds.push(feedResult.result[i]);        
                }
            
                //self.feedsSyncer.sync(self.feeds);
            } else {
                self.feeds = [];
            }
        },  
        error: function() {
            self.feeds = [];
        } 
    });
    return this.feeds;
  }

  getFishes(): any[] {
    var self = this;
    $.ajax({ 
    	async:false,
        type: "post", 
        url: this.url, 
        data:{
            fname:"getfishes"
        },
        success: function (data) { 
            console.log("fishes" + data);
            var fishResult = JSON.parse(data);
            if (fishResult.success == 1) {
                self.fishes = [];
                for (var i = 0; i < fishResult.result.length; i++) {
                    self.fishes.push(fishResult.result[i]);
                }

                //self.fishSyncer.sync(self.fishes);
            }
        }, 
        error: function() {
            self.fishes = [];
        } 
    });
    return this.fishes;
  }

}
