import request from '../../../http.js';
const { requestSubscribeMessage } = requirePlugin('subscribeMsg');
Page({
  data: {
    signBanShow2:true,
    onPen:0,
    start:0,
    templateId1: 'd55c1a91acd5467c9a78d3cd06c85e46',
    templateId2: '',
    templateId3: '',
    modalShow:false,
    modalname:'',
    timer:'',
    downNum:0,
    show:true,
     resourceId: "AD_20210521000000100691",
     bottomLists:[]
  },
   
  onLoad() {

      var verShow= my.getStorageSync({ key: 'verShow' }).data
    if(verShow){
         this.setData({
            verShow:true
          })
    }
     var alBanShow= my.getStorageSync({ key: 'alBanShow' }).data
    if(alBanShow){
         this.setData({
            alBanShow:true
          })
    }
     var usercount= my.getStorageSync({ key: 'usercount' }).data;
     this.setData({
            usercount:usercount
      })
     var rwTs= my.getStorageSync({ key: 'rwTs' }).data
    if(rwTs){
         this.setData({
            rwTs:rwTs
          })
    }
     var rwdh= my.getStorageSync({ key: 'rwdh' }).data
    if(rwdh){
         this.setData({
            rwdh:rwdh
          })
    }
    this.GetSignList();
     this.GetUserModel();
    this.GetTaskList();
    this.GetYunMa()
    this.GetAdvertList();
    this.setData({
      onPen:1
    })
  },

 onRenderSuccess(e){
    console.log('阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            signBanShow:true
          })
    }else{
         this.setData({
            signBanShow:false
          })
    }
  },
  //签到广告加载回调
  onRenderSuccess_sign(e){
   
    if(e.detail.height>0){
          this.setData({
            signBanShow2:true,
            start:1
          })
    }else{
         this.setData({
            signBanShow2:false,
            start:1
          })
    }
    console.log('签到阿里广告加载回调',e)
  },
  onHide(){
    this.setData({
      onPen:0
    })
  },
  onShow(){
      // 页面显示
      if(this.data.onPen==1){
        return;
      }
      var token=my.getStorageSync({ key: 'token' }).data;
      if(token){
        this.GetUserModel();
        this.GetTaskList();
        this.GetAdvertList();
      }
    if(this.data.time){
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
					let useTime=timestamp-this.data.time;
					console.log('useTime',useTime)
				if(useTime>=this.data.BrowseTime){
					console.log('观看时间达到条件')
					this.AddReward();
					//当前观看的时间大于等于接口返回的条件时间数，请求添加收益接口
				}else{
           if(this.data.rwName=='taobao'){
            this.setData({
              modalname:'taobao',
              rwName:'',
              // time:'',
              // times:'',
              // timets:''
            });return
          }
					my.alert({
						content:'访问'+this.data.BrowseTime+'秒以上才能领取奖励哦'
          })
          // this.setData({
          //   time:'',
          //   times:'',
          //   timets:''
          // })
        }
        return;
			}
			//签到广告观看时间
			if(this.data.times){
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
					let useTime=timestamp-this.data.times;
					console.log('useTime',useTime)
				if(useTime>=this.data.BrowseTimes){
					console.log('特殊广告观看时间达到条件')
					this.AddSign()
					//当前观看的时间大于等于接口返回的条件时间数，请求添加收益接口
				}else{
					my.alert({
						content:'访问'+this.data.BrowseTimes+'秒以上才能领取奖励哦'
          })
          this.setData({
            time:'',
            times:'',
            timets:''
          })
				}
      }
    			//特殊广告观看时间
			if(this.data.timets){
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
					let useTime=timestamp-this.data.timets;
					console.log('useTime',useTime)
				if(useTime>=this.data.BrowseTimets){
          console.log('特殊广告观看时间达到条件')
					this.AddReward()
					//当前观看的时间大于等于接口返回的条件时间数，请求添加收益接口
				}else{
					my.alert({
						content:'访问'+this.data.BrowseTimets+'秒以上才能领取奖励哦'
          })
				}
      }
      
       //判断云码是否关注成功
      var taskid=my.getStorageSync({ key: 'taskid' }).data
      if(taskid){
          this.setData({
            keyid:my.getStorageSync({ key: 'taskid' }).data,//云码id
            Id:my.getStorageSync({ key: 'id' }).data//列表id
          })
          this.TaskIsTrue()
      }
  },
  onRenderSuccess_rwwc(e){
     console.log('任务完成阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            rw_alBanShow:true
          })
    }else{
       this.setData({
            rw_alBanShow:false
          })
    }
  },
  onRenderSuccess_tswc(e){
     console.log('任务完成阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            tsrw_alBanShow:true
          })
    }else{
       this.setData({
            tsrw_alBanShow:false
          })
    }
  },
  //流量位插件回调
onCompletes(data){
  console.log('广告位回调',data)
  this.setData({
    Id:this.data.aliggList[0].Id
  })
  this.AddReward()
},
  //立即签到
  immediately(){
        if(this.data.downNum>0){
          my.showToast({
            type:'none',
            content:'签到时间未到'
          })
          return;
        }
				if(this.data.list.Number-this.data.list.Signnumber==0){
          console.log('今日次数已用完')
          my.showToast({
            type:'none',
            content:'今日签到次数为0'
          })
						return;
				}
				if(this.data.list.SignOutputList[this.data.list.Qd].IsAliAdver){
          this.setData({
            	modalname:'first'
          })
					return;
				}
				this.AddSign()
      },
  //签到接口
  AddSign(){
				// if(this.data.list.SignOutputList[this.data.nextDay].Number-this.data.list.Signnumber<=this.data.list.Number){
				// 	var num=this.data.nextDay-1
				// }else{
				// 	var num=this.data.nextDay
        // }
        var that=this;
        var num=this.data.nextDay;
        this.setData({
          todayIndex:this.data.list.Qd,
        })
        request('/api/v2/User/AddSign/AddSign','POST',{signId:this.data.list.SignOutputList[this.data.list.Qd].Id}).then(res=>{
           if(res.success){
                that.setData({
                      times:'',
                      openModal:true,
                      downNum:this.data.list.SignOutputList[this.data.list.Qd].Interval
                })
                
				       	this.GetUserModel()
                this.GetSignList();
                this.countDown(this.data.downNum)
				       }else{
				       	my.showToast({
				       		type:'none',
				       		content:res.msg
				       	})
				       }
        })
      },
      //定时器倒计时
			countDown(num){
        var nums=num*1100;
        var that=this;
        var timer=this.data.timer;
        console.log('开启定时器');
				timer=setInterval(()=>{
					if(that.data.downNum>0){
             console.log('开启定时器-1');
            that.setData({
              	downNum:that.data.downNum-1
            })
					}
				},1000)
				setTimeout(()=>{
          clearInterval(timer)
				},nums)
			},
   //获取用户信息
  GetUserModel(){
      request('/api/v2/User/GetUserDetail/GetUserModel','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          userInfo:res.data
        })
      })
  },
   jump_Mycoin(){
        my.navigateTo({
          url:'/pages/child/exchange/exchange'
        })
      },
 //获取签到列表及其签到天数
  GetSignList(){
        request('/api/v2/User/GetSignList/GetSignList','GET').then(res=>{
          console.log(res);
             if(res.success){
                this.setData({
                  list:res.data
                }) 
                let list=res.data.SignOutputList;
                let countMoney=0
                for(var i=0;i<list.length;i++){
                    if(list[i].Type==0){
                      countMoney+=list[i].RewardAmount
                    }
                };
                let xianjin=countMoney/10000;
                this.setData({
                  countMoney:countMoney,
                  xianjin:xianjin.toFixed(2)
                })
          }
        })
			},
  //获取阿里广告接口
			 GetAdvertList(){
				request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'rwwc&'}).then(res=>{
					console.log('banner',res);
					if(res.success){
            this.setData({
              rwBanner:res.data
            })
					}
				})
      },
 //云码数据获取
  GetYunMa(){
     request('/api/v5/Activity/GetYMTaskList','GET',{TaskArea:'rw&'}
              ).then(result=>{
                if(result.success){
                    var nowList=result.data;
                     for(var i=0;i<nowList.length;i++){
                          nowList[i].YMJsonString=JSON.parse(nowList[i].YMJsonString)
                      }
                  if(result.data.length > 0){
                     this.setData({
                        ymrwList:nowList,
                      }) 
                  }
                }
              })
  },
       //获取任务数据
  GetTaskList(){
				  //任务区（云码气泡区进行合并）
          request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'rw&'}
                ).then(res=>{
                  if(res.success){
                    this.setData({
                      bottomLists:res.data
                    })
                      my.uma.trackEvent('zoulu_02',{'show':1})
                  }
                })
        
         //签到时灯火广告没有加载系统对应图片
				 request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'qdtpgg'}
				 ).then(res=>{
				 					 if(res.success){
                      this.setData({
                          signBanner:res.data.ts
                      })
				 					 }
         })

        	request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'qdymtsgg'},
				).then(aligg=>{
					if(aligg.success){
            this.setData({
               sdaliggList:aligg.data.ts
             })
					}
        })
        	request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'aligg&'},
				).then(aligg=>{
					if(aligg.success){
            this.setData({
               aliggList:aligg.data.ts
             })
					}
        })
        	request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'QD&'},
				).then(aligg=>{
					if(aligg.success){
            this.setData({
               qdBanner:aligg.data.ts
             })
					}
        })
         //特殊广告
				 request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'qdymtstc'}
				 ).then(res=>{
				 					 if(res.success){
                      this.setData({
                        tsggList:res.data
                      })
				 					 }
         })
         //特殊广告对应图片
				 request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'qdytstc'}
				 ).then(res=>{
				 					 if(res.success){
                      this.setData({
                          tsggList2:res.data.ts
                      })
				 					 }
         })
          //一进入页面显示的红包
         request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'qdhb'}
				 ).then(qdhb=>{
					 if(qdhb.success){
             this.setData({
                	qdhbList:qdhb.data.ts
             })
						if(qdhb.data[0].IsDone==false){
              this.setData({
                  	modalname:'qdhb'
              })
						
							this.delHg(qdhb.data[0].Id)
						}
					 }
				 })
      },
      //红包接口(第一次进入页面显示红包并请求接口)
			delHg(Id){
				request('/api/v2/Activity/SignRedEnvelope/SignRedEnvelope','GET',{Id:Id},
				).then(res=>{
					console.log(res)
				})
			},
      closeModal(){
        this.setData({
          modalname:'',
          modalShow:false
        })
      },
      //点击签到广告
			jump_bannerTs(e){
        var that=this;
        let index=e.currentTarget.dataset.index;
        	var list=this.data.list.SignOutputList[this.data.list.Qd];
        if(index==0){
              console.log('您点击了广告',list);
              this.setData({
                    BrowseTimes:list.BrowseTime,
                    Ids:list.Id
              })
			      	this.watchTaobo2()
        }else{
          console.log('index==1')
          let JumpType=e.currentTarget.dataset.JumpType;
          let item=e.currentTarget.dataset.item;
           this.setData({
                    BrowseTimes:item.BrowseTime,
                    Ids:item.Id
              })
          	if(JumpType==1){
         
              this.setData({
                          modalname:'life',
                          lifeImg:item.Img,
                          lifeTittle:item.Title,
                          lifeSutittle:item.Subtitle,
                          sceneId:item.Component
                    })
          
					console.log('关注生活号')
					return;
        }
				if(JumpType==2){
              console.log('收藏小程序')
              my.setStorageSync({
                          key: 'Id',
                          data: item.Id
                });
               
                  this.setData({
                      BrowseTime:item.BrowseTime,
                  })
                  that.watchTaobo2();
                
              
              my.navigateToMiniProgram({
                appId:item.APPID,
                path:item.AliAdvertisingLink,
                success:(res)=> {
                }
              })
					return;
        }
				if(JumpType==3){
          console.log('跳转小程序评价')
          
            this.setData({
                BrowseTime:item.BrowseTime,
            })
            that.watchTaobo2();
					
					
					my.navigateToMiniProgram({
						appId:item.APPID,
						path:item.AliAdvertisingLink,
						success:(res)=> {
							// that.watchTaobo()
						}
					})
					return;
				}
				if(JumpType==4){
					console.log('跳转直播间')
            this.setData({
                rwName:'taobao',
                BrowseTime:item.BrowseTime,
            })
            that.watchTaobo2();
					my.ap.navigateToAlipayPage({
						path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttps://api.shupaiyun.com/jumptb1.html?id='+item.Id,
						// path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttp://192.168.0.132:8848/tb/jump2.html?id='+item.Id,
						success:(res) => {
							
					        // my.alert({content:'系统信息' + JSON.stringify(res)});
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					
					return;
				}
				if(JumpType==5||JumpType==6||JumpType==14){
          console.log('link',item.AliAdvertisingLink)
          //生活号文章-h5
          
            this.setData({
                BrowseTime:item.BrowseTime,
            })
            that.watchTaobo2();
					my.ap.navigateToAlipayPage({
						path:item.AliAdvertisingLink,
						success:(res) => {
					      
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					return;
				}
			
        if(JumpType==7){
          console.log('添加桌面');
           my.setStorageSync({
                          key: 'zid',
                          data: item.Id
                });
          this.setData({
            RewardAmount:item.RewardAmount,
            modalname:'zhuomian'
          })
          
           return;
				}
				if(JumpType==8){
					my.navigateTo({
						url:'../child/sign/sign'
					})
					return;
				}
				if(JumpType==9){
					console.log('跳转金币明细')
					my.navigateTo({
						url:'../child/balanceDetail/balanceDetail'
					})
					return;
				}
				if(JumpType==10){
					console.log('跳转邀请好友')
					// my.navigateTo({
					// 	url:'../invation/invation'
					// })
					my.navigateTo({
						url:'../child/invitation/invitation?taskid='+item.Id
					})
					return;
        }
        if(JumpType==11){
          console.log('跳转其他小程序');
          
            this.setData({
                BrowseTime:item.BrowseTime,
            })
            that.watchTaobo2();
				
					
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink + '?BrowseTime=' + item.BrowseTime+ '&id=' + item.Id + '&jl=' + item.RewardAmount,
                  extraData:{
                    appId:"2021002145669883",
                    appName:'掌上步数-数盟'
                  },
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
             });
					return;
        }
         if(JumpType==12){
            console.log(item);
             if(item.IsDone==false){
                this.setData({
                    BrowseTime:item.BrowseTime,
                    Id:item.Id
                })
            that.watchTaobo();
						my.uma.trackEvent('renwu_02',{'click':1})
					}
            if(item.AliAdvertisingLink){
                my.navigateTo({
                  url:item.AliAdvertisingLink + '?BrowseTime=' + item.BrowseTime+ '&id=' + item.Id + '&jl=' + item.RewardAmount
                })
            }else{
              my.alert({
                content:'参数有误,请联系管理人员'
              })
            }
            return;
        }
        if(JumpType==13){
            console.log('云码入会',item.YMJsonString.TaskType);
             const ym=item.YMJsonString;
          
               this.setData({
              Id:item.Id,
              taskid:item.YMJsonString.TaskId
            })
            my.setStorageSync({
              key: 'taskid',
              data:item.YMJsonString.TaskId//云码id
            })
             my.setStorageSync({
              key: 'id',//列表id
              data:item.Id
            })
            
             const taskType = item.YMJsonString.TaskType;  
            const alipayOpenId = this.data.userInfo.AliAppletOpenId;  
            const taskId = item.YMJsonString.TaskId;   
            const channel ='QD-XMSP-229715';  // 测试时为test , 生产时候为 channelId(向产品索取)  
            var link ='https://d.alipay.com/?scheme=' + encodeURIComponent('alipays://platformapi/startApp?appId=2021002145669883&page=pages%2Findex%2Findex%3Fyunmaid%3D'+taskId);  // 任务完成后续跳转, 浏览商品没有  
            //link = "https%3A%2F%2Fd.alipay.com%2F%3Fscheme%3Dalipays%3A%2F%2Fplatformapi%2FstartApp%3FappId%3D2021002145669883%26page%3Dpages%2Findex%2Findex%3Fyunmaid%3D123";
            link =encodeURIComponent('alipays://platformapi/startApp?appId=2021002145669883&page=pages%2findex%2findex%3fyunmaid%3d123');  // 任务完成后续跳转, 浏览商品没有  
            const userId = '12345677';  
            const userNick= '123XXX';
            const content= item.YMJsonString.Content;
            const appId = '2021002145669883'  // 小程序ID  
            const pages = `page/index/index?extra=${encodeURIComponent(JSON.stringify({a:1,b:'你好'}))}` // 小程序中需要跳转页面  extra中存放额外参数  
            const appUrl = `alipays://platformapi/startapp?${encodeURIComponent(`appId=${appId}&page=${encodeURIComponent(pages)}`)}`   
            const url = `${content}&taskType=${taskType}&alipayOpenId=${alipayOpenId}&taskId=${taskId}&channel=${channel}&link=${encodeURIComponent(link)}`;
           console.log('url',url)
        // return;
        my.ap.navigateToAlipayPage({
					 path:encodeURIComponent(`https://render.alipay.com/p/h5/cloudcode-fe/redirect.html?target=${encodeURIComponent(url)}`),
						success:(res) => {
					     
					    },
					    fail:(error) => {
					        my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
          })
        }
        if(JumpType==15){
          console.log('添加支付宝首页');
           my.setStorageSync({
                          key: 'sid',
                          data: item.Id
                });
          this.setData({
            RewardAmount:item.RewardAmount,
            modalname:'zfbsy'
          })
          
           return;
        }
        if(JumpType==16){
            this.setData({
              templateId1:item.APPID
            })
            this.onTapBtn_rw()
            
        }
        }
			
      },
      watchTaobo2(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
            this.setData({
                times:timestamp,
                modalShow:false,
				        modalname:''
            })
				    console.log("当前时间戳为：" + timestamp);   
				
			},
			watchTaobo(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
             this.setData({
                time:timestamp,
                modalShow:false,
				        modalname:''
            })
				    console.log("当前时间戳为：" + timestamp); 
      },
      //特殊广告收益接口
			 AddRewardts(){
				var that=this;
				request('/api/v5/Activity/AddReward','POST',{taskId:this.data.Id}).then(res=>{
					if(res.success){
           
							if(res.data.RewardAmount>0){
                  this.setData({
                    	RewardAmount:res.data.RewardAmount,
                      modalType:res.data.Type,
                      modalname:'ts',
                      tsnum:1
                  })
							}
							console.log('观看特殊广告增加金币成功')
							console.log(res.data.RewardAmount);
              setTimeout(()=>{
                  that.GetTaskList();
                },1000)
              that.setData({
                timets:''
              })
							that.$uma.trackEvent('zoulu_02',{'success':1});
					}else{
						   my.showToast({
							content:res.msg,
							type:'none'
						   })
					}
				})
				
			},
//默认增加金币/集分宝接口
			 AddReward(){
         var that=this;
          request('/api/v5/Activity/AddReward','POST',{ taskId: this.data.Id,Mark:my.getStorageSync({ key: 'Mark' }).data,UserId:my.getStorageSync({ key: 'UserId' }).data}).then(res=>{
            if(res.success){
                console.log('增加金币成功')
                 my.removeStorageSync({
                    key: 'id',
                  });
                  my.removeStorageSync({
                    key: 'taskid',
                  });
                 my.removeStorageSync({
                  key: 'zid',
                });
                my.removeStorageSync({
                key: 'zhuomianShow',
              });
               my.removeStorageSync({
                  key: 'sid',
                });
                my.removeStorageSync({
                key: 'zfbsy',
              });
             
                if(res.data.usercount==0){
                    this.setData({
                       rwName:'',
                    modalname:'rwts',
                    time:'',
                    Id:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:false
                    })
                }else{
                    this.setData({
                    rwName:'',
                    modalname:'',
                    time:'',
                    Id:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:true
                })
                }
              
              
                my.uma.trackEvent('zoulu_02',{'success':1});
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
           setTimeout(()=>{
                  that.GetTaskList();
          },1000)
        },
      //关闭签到模态框
			close(){
        this.setData({
          openModal:false
        })
        if(this.data.list.Signnumber==1){
            this.onTapBtn()
        }
      },
      	// 订阅授权
				  onTapBtn(e) {
					  var that=this;
					  console.log('e')
				    // 模板id列表
				    const templateList = [];
				    this.data.templateId1 && templateList.push(this.data.templateId1);
				    this.data.templateId2 && templateList.push(this.data.templateId2);
				    this.data.templateId3 && templateList.push(tthis.data.templateId3);
				    if (templateList.length === 0) {
				      my.showToast({
				        type: 'fail',
				        content: '请填写模板id',
				        duration: 3000,
				      });
				      return;
				    }
				
				    // 调用方法，唤起订阅组件
				    requestSubscribeMessage({
				      // 模板id列表，最多3个
				      entityIds: templateList,
				      // 接收结果的回调方法
				      callback(res) {
				        console.log('订阅回调', res);
				        if (res.success){
				          const successIds = templateList
				            .filter(i => res[i.entityId] === 'accept')
				            .map(i => i.entityId);
							if(that.data.list.Signnumber==1){
								that.sendMes()
							}
				          // 订阅成功
				          // my.call('toast', {
				          //   content: `模板${successIds.join(',')}订阅成功`,
				          //   type: 'success',
				          // });
				        } else {
				          switch (res.errorCode) {
				            case 11: {
				              my.call('toast', {
				                content: '用户未订阅关闭弹窗',
				              });
				              break;
				            }
				            default: {
				              my.call('toast', {
				                content: `ErrorCode: ${res.errorCode}, ErrorMsg: ${res.errorMessage}`,
				              });
				              break;
				            }
				          }
				        }
				      },
				    });
      },
      sendMes(){
				request('/api/v2/Push/Push','GET',{templateId:this.data.templateId1}).then(res=>{
					console.log(res)
				})
      },
       //关注生活号回调
			  closeCb(e){
            console.log('已经关注完生活号,请求金币收益接口');
            if(e.detail.followed==true){
              this.setData({
                modalname:''
              })
					   this.AddRewardPublic();
				  }
        },
         //关注工作号请求的增加金币/集分宝接口接口
			AddRewardPublic(){
        if(!this.data.Id){
          return;
        }
				var that=this;
				request('/api/v5/Activity/AddReward','POST',{taskId:this.data.Id,Mark:my.getStorageSync({ key: 'Mark' }).data,UserId:my.getStorageSync({ key: 'UserId' }).data},
				).then(res=>{
          if(res.success==true){
            
                my.uma.trackEvent('zoulu_02',{'success':1});
               this.setData({
                   Id:'',
                   RewardAmount:res.data.RewardAmount,
                   modalType:res.data.Type,
                   modalShow:true
               })
                 setTimeout(()=>{
                  that.GetTaskList();
                },1000)
              }
          })
      },
       //任务跳转页面
			tabNav(e){
        let JumpType=e.currentTarget.dataset.JumpType;
        let item=e.currentTarget.dataset.item;
        var that=this;
        if(item.IsAliAdvert==1&&this.data.alBanShow&&this.data.rwdh.length>0){
          this.setData({
           ['rwdh[0].Id']:item.Id,
           modalname:'rwdh'
          })
          return;
        }
				if(JumpType==1){
          if(item.IsDone==false){
              this.setData({
                          modalname:'life',
                          lifeImg:item.Img,
                          lifeTittle:item.Title,
                          lifeSutittle:item.Subtitle,
                          sceneId:item.Component
                    })
                  
               my.uma.trackEvent('zoulu_02',{'click':1})
          }
          this.setData({
            Id:item.Id
          })
					console.log('关注生活号')
					return;
        }
				if(JumpType==2){
              console.log('收藏小程序')
              my.setStorageSync({
                          key: 'Id',
                          data: item.Id
                });
                if(item.IsDone==false){
                  this.setData({
                      BrowseTime:item.BrowseTime,
                      Id:item.Id
                  })
                  that.watchTaobo();
                  my.uma.trackEvent('zoulu_02',{'click':1})
              }
              my.navigateToMiniProgram({
                appId:item.APPID,
                path:item.AliAdvertisingLink,
                success:(res)=> {
                }
              })
					return;
        }
				if(JumpType==3){
          console.log('跳转小程序评价')
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('zoulu_02',{'click':1})
					}
					my.navigateToMiniProgram({
						appId:item.APPID,
						path:item.AliAdvertisingLink,
						success:(res)=> {
							// that.watchTaobo()
						}
					})
					return;
				}
				if(JumpType==4){
					console.log('跳转直播间')
					 if(item.IsDone==false){
            this.setData({
                rwName:'taobao',
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('zoulu_02',{'click':1})
					}
					my.ap.navigateToAlipayPage({
						path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttps://api.shupaiyun.com/jumptb1.html?id='+item.Id,
						// path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttp://192.168.0.132:8848/tb/jump2.html?id='+item.Id,
						success:(res) => {
							
					        // my.alert({content:'系统信息' + JSON.stringify(res)});
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					
					return;
				}
				if(JumpType==5||JumpType==6||JumpType==14){
          //生活号文章-h5
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('zoulu_02',{'click':1})
					}
					my.ap.navigateToAlipayPage({
						path:item.AliAdvertisingLink,
						success:(res) => {
					      
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					return;
				}
			
        if(JumpType==7){
          console.log('添加桌面');
           my.setStorageSync({
                          key: 'zid',
                          data: item.Id
                });
          this.setData({
            RewardAmount:item.RewardAmount,
            modalname:'zhuomian'
          })
           my.uma.trackEvent('zoulu_02',{'click':1})
           return;
				}
				if(JumpType==8){
					my.navigateTo({
						url:'../child/sign/sign'
					})
					return;
				}
				if(JumpType==9){
					console.log('跳转金币明细')
					my.navigateTo({
						url:'../child/balanceDetail/balanceDetail'
					})
					return;
				}
				if(JumpType==10){
					console.log('跳转邀请好友')
					// my.navigateTo({
					// 	url:'../invation/invation'
					// })
					my.navigateTo({
						url:'../child/invitation/invitation?taskid='+item.Id
					})
					return;
        }
        if(JumpType==11){
          console.log('跳转其他小程序');
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('zoulu_02',{'click':1})
					}
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink + '?BrowseTime=' + item.BrowseTime+ '&id=' + item.Id + '&jl=' + item.RewardAmount,
                  extraData:{
                    appId:"2021002145669883",
                    appName:'掌上步数-数盟'
                  },
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
             });
					return;
        }
        if(JumpType==12){
            console.log(item);
             if(item.IsDone==false){
                this.setData({
                    BrowseTime:item.BrowseTime,
                    Id:item.Id
                })
            that.watchTaobo();
						my.uma.trackEvent('renwu_02',{'click':1})
					}
            if(item.AliAdvertisingLink){
                my.navigateTo({
                  url:item.AliAdvertisingLink + '?BrowseTime=' + item.BrowseTime+ '&id=' + item.Id + '&jl=' + item.RewardAmount
                })
            }else{
              my.alert({
                content:'参数有误,请联系管理人员'
              })
            }
            return;
        }
        if(JumpType==13){
            console.log('云码入会',item.YMJsonString.TaskType);
             const ym=item.YMJsonString;
            if(item.IsDone==false){
               this.setData({
              Id:item.Id,
              taskid:item.YMJsonString.TaskId
            })
            my.setStorageSync({
              key: 'taskid',
              data:item.YMJsonString.TaskId//云码id
            })
             my.setStorageSync({
              key: 'id',//列表id
              data:item.Id
            })
            }
             const taskType = item.YMJsonString.TaskType;  
            const alipayOpenId = this.data.userInfo.AliAppletOpenId;  
            const taskId = item.YMJsonString.TaskId;   
            const channel ='QD-XMSP-229715';  // 测试时为test , 生产时候为 channelId(向产品索取)  
            var link ='https://d.alipay.com/?scheme=' + encodeURIComponent('alipays://platformapi/startApp?appId=2021002145669883&page=pages%2Findex%2Findex%3Fyunmaid%3D'+taskId);  // 任务完成后续跳转, 浏览商品没有  
            //link = "https%3A%2F%2Fd.alipay.com%2F%3Fscheme%3Dalipays%3A%2F%2Fplatformapi%2FstartApp%3FappId%3D2021002145669883%26page%3Dpages%2Findex%2Findex%3Fyunmaid%3D123";
            link =encodeURIComponent('alipays://platformapi/startApp?appId=2021002145669883&page=pages%2findex%2findex%3fyunmaid%3d123');  // 任务完成后续跳转, 浏览商品没有  
            const userId = '12345677';  
            const userNick= '123XXX';
            const content= item.YMJsonString.Content;
            const appId = '2021002145669883'  // 小程序ID  
            const pages = `page/index/index?extra=${encodeURIComponent(JSON.stringify({a:1,b:'你好'}))}` // 小程序中需要跳转页面  extra中存放额外参数  
            const appUrl = `alipays://platformapi/startapp?${encodeURIComponent(`appId=${appId}&page=${encodeURIComponent(pages)}`)}`   
            const url = `${content}&taskType=${taskType}&alipayOpenId=${alipayOpenId}&taskId=${taskId}&channel=${channel}&link=${encodeURIComponent(link)}`;
           console.log('url',url)
        // return;
        my.ap.navigateToAlipayPage({
					 path:encodeURIComponent(`https://render.alipay.com/p/h5/cloudcode-fe/redirect.html?target=${encodeURIComponent(url)}`),
						success:(res) => {
					     
					    },
					    fail:(error) => {
					        my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
          })
        }
        if(JumpType==15){
          console.log('添加支付宝首页');
           my.setStorageSync({
                          key: 'sid',
                          data: item.Id
                });
          this.setData({
            RewardAmount:item.RewardAmount,
            modalname:'zfbsy'
          })
           my.uma.trackEvent('zoulu_02',{'click':1})
           return;
        }
        if(JumpType==16){
            this.setData({
              Id:item.Id,
              templateId1:item.APPID
            })
            this.onTapBtn_rw()
             my.uma.trackEvent('zoulu_02',{'click':1});
             return
        }
         if(JumpType==18) {
              console.log(item,'跳转内链');
                      my.setStorageSync({
                        key: 'nltime',
                        data: item.BrowseTime //云码id
              }) 
              // if(my.getStorageSync({key: 'djstime'}).data){
              // item.BrowseTime=item.BrowseTime-my.getStorageSync({key: 'djstime'}).data
              // } 
              if (item.IsDone == false) {
                      this.setData({
                        BrowseTime: item.BrowseTime,
                        Id: item.Id
              }) 
              that.watchTaobo();
              }
                    if (item.AliAdvertisingLink) {
                      my.navigateTo({
                        url:item.AliAdvertisingLink+'?id='+item.Id+'&jl='+item.RewardAmount
                      })
                    } else {
                      my.alert({
                        content: '参数有误,请联系管理人员'
                      })
                    }
                    return;
          }
      },
      	// 任务订阅授权
				  onTapBtn_rw(e) {
					  var that=this;
					  console.log('e')
				    // 模板id列表
				    const templateList = [];
				    this.data.templateId1 && templateList.push(this.data.templateId1);
				    this.data.templateId2 && templateList.push(this.data.templateId2);
				    this.data.templateId3 && templateList.push(tthis.data.templateId3);
				    if (templateList.length === 0) {
				      my.showToast({
				        type: 'fail',
				        content: '请填写模板id',
				        duration: 3000,
				      });
				      return;
				    }
				
				    // 调用方法，唤起订阅组件
				    requestSubscribeMessage({
				      // 模板id列表，最多3个
				      entityIds: templateList,
				      // 接收结果的回调方法
				      callback(res) {
				        console.log('订阅回调', res);
				        if (res.success){
				          const successIds = templateList
				            .filter(i => res[i.entityId] === 'accept')
				            .map(i => i.entityId);
						
								that.sendMes()
						
				          // 订阅成功
				          // my.call('toast', {
				          //   content: `模板${successIds.join(',')}订阅成功`,
				          //   type: 'success',
				          // });
				        } else {
				          switch (res.errorCode) {
				            case 11: {
				              my.call('toast', {
				                content: '用户未订阅关闭弹窗',
				              });
				              break;
				            }
				            default: {
				              my.call('toast', {
				                content: `ErrorCode: ${res.errorCode}, ErrorMsg: ${res.errorMessage}`,
				              });
				              break;
				            }
				          }
				        }
				      },
				    });
      },
      jump_allTasks(){
        my.navigateTo({
          url:'/pages/child/allTasks/allTasks'
        })
      },
      //点击阿里广告第一次
			jump_banner(e){
        let num=e.currentTarget.dataset.num;
        let modalInfo=e.currentTarget.dataset.modalInfo;
        let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo);
        this.setData({
          	timets:''
        })
				if(this.data.userInfo.NumberCompletions>=num&&modalInfo==false){
					console.log('有收益')
					this.setData({
            //modalname:'ts',
					  BrowseTimets:item.BrowseTime,
					  Id:item.Id
          })
					this.watchTaobo3()
				}
			},
			//点击阿里广告第二次
			jump_bannerSecond(e){
         let num=e.currentTarget.dataset.num;
        let modalInfo=e.currentTarget.dataset.modalInfo;
        let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo)
				if(this.data.userInfo.NumberCompletions>=num&&modalInfo==false){
					console.log('有收益')
				this.setData({
            BrowseTimets:'',
					  BrowseTime:item.BrowseTime,
					  Id:item.Id
          })
					this.watchTaobo1();
				}
      },
      watchTaobo1(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
				    timestamp = timestamp / 1000;  
          this.setData({
              time:timestamp
          })
				    console.log("当前时间戳为：" + timestamp);   
			},
      watchTaobo3(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;
            this.setData({
                timets:timestamp,
               
            })
				    console.log("当前时间戳为：" + timestamp); 
				    
      },
      jump_allTasks(){
          my.navigateTo({
            url:'/pages/child/allTasks/allTasks'
          })
    },
    //查找云码任务是否关注成功
    TaskIsTrue(){
      	request('/api/v4/Activity/TaskIsTrue','GET',{keyid:this.data.keyid}).then(res=>{
					console.log('查找云码任务是否关注成功',res);
					if(res.success){
              this.AddReward()
					}else{
            my.alert({
              content:'需要完成任务,才能领取奖励'
            })
             my.removeStorageSync({
                    key: 'id',
                  });
            my.removeStorageSync({
              key: 'taskid',
            });
          }
				})
    },
});
