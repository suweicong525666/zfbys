import request from '../../../http.js';
Page({
  data: {
    targetTime1: 0,
    myFormat: ["时", "分", "秒"],
    myFormat1: ["天", "时", "分", "秒"],
    status: "进行中...",
    clearTimer: false,
    templateId1: '892ee3cf2d0c47ab82867ee1adf06adc',
    templateId2: '',
    templateId3: '',
    modalShow:false,
    modalname:'',
    timer:'',
    downNum:0,
    show:true,
    cdShow:false,
     resourceId: "AD_20210325000000100457",
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
    this.setData({
            targetTime: new Date().getTime() + 64300000,
        });
  },
 
  onShow(){
      // 页面显示
      var token=my.getStorageSync({ key: 'token' }).data;
      if(token){
        this.GetUserModel();
        this.GetTaskList();
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
					my.alert({
						content:'访问'+this.data.BrowseTime+'秒以上才能领取奖励哦'
          })
          this.setData({
            time:'',
            times:'',
            timets:''
          })
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
jump_exchangeDetail(){
  my.navigateTo({
    url: '/pages/child/exchangeDetail/exchangeDetail'
  });
} ,    
   //获取用户信息
  GetUserModel(){
      request('/api/v2/User/GetUserDetail/GetUserModel','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          userInfo:res.data
        });
        this.GetActivityLotteryList()
      })
  },
  //获取红包列表
 GetActivityLotteryList(){
    request('/api/v3/Activity/GetActivityLotteryList','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          hbList:res.data,
          targetTime:new Date().getTime()+res.data[0].Time,
          cdShow:true
        })
      })
  },
 
//抽奖
choujiang(e){
  console.log(e)
  let SoldOut=e.currentTarget.dataset.SoldOut;
  let id=e.currentTarget.dataset.id;
  let quota=e.currentTarget.dataset.quota;
   request('/api/v3/Activity/GetActivityLotteryList','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        if(res.data[0].Time>0){
          my.showToast({
            content:'时间未到',
            type:'none'
          });
        }else{
          if(SoldOut==true){
                  my.showToast({
                    content:'奖励已经兑完，下次加快手速哦',
                    icon:'none'
                  });return;
                }
          if(quota<1){
               this.SaveActivityLottery(id)
          }
           
        }
      })
  
     
},
 //抽奖接口
 SaveActivityLottery(id){
    request('/api/v3/Activity/SaveActivityLottery','POST', {LotteryId:id
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
          if(res.success){
              my.showToast({
                content:'兑换成功',
                type:'success'
              });
              this.GetUserModel()
          }else{
            my.showToast({
                content:res.msg,
                type:'none'
              });
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
      closeModal(){
        this.setData({
          modalname:'',
          modalShow:false
        })
      },
      //点击签到广告
			jump_bannerTs(){
				var list=this.data.list.SignOutputList[this.data.nextDay-1];
				console.log('您点击了广告',list);
				this.setData({
            	BrowseTimes:list.BrowseTime,
			      	Ids:list.Id
        })
				this.watchTaobo2()
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
							console.log('观看特殊广告增加开心币成功')
							console.log(res.data.RewardAmount);
              setTimeout(()=>{
                  that.GetTaskList();
                },1000)
              that.setData({
                timets:''
              })
							that.$uma.trackEvent('zhibo_01',{'success':1});
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
            console.log('已经关注完生活号,请求开心币收益接口');
            if(e.detail.followed==true){
              this.setData({
                modalname:''
              })
					   this.AddRewardPublic();
				  }
        },
         //关注工作号请求的增加开心币/集分宝接口接口
			AddRewardPublic(){
        if(!this.data.Id){
          return;
        }
				var that=this;
				request('/api/v5/Activity/AddReward','POST',{taskId:this.data.Id,Mark:my.getStorageSync({ key: 'Mark' }).data,UserId:my.getStorageSync({ key: 'UserId' }).data},
				).then(res=>{
          if(res.success==true){
                my.uma.trackEvent('zhibo_01',{'success':1});
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
    myLinsterner(e) {
        this.setData({
            status: "已经开始"
        });
    }
});
