import request from '../../../http.js';
const { requestSubscribeMessage } = requirePlugin('subscribeMsg');

Page({
  data: {
     onPen:0,
    list:[],
    show:true,
    page:1,
    size:40,
    modalShow:false,
    templateId1:''
  },
  onLoad() {
    this.setData({
      onPen:1
    })
    var alBanShow= my.getStorageSync({ key: 'alBanShow' }).data
    if(alBanShow){
         this.setData({
            alBanShow:true
          })
    }
     var rwTs= my.getStorageSync({ key: 'rwTs' }).data;
    if(rwTs){
      this.setData({
            rwTs:rwTs
      })
    }
    var rwdh= my.getStorageSync({ key: 'rwdh' }).data;
    if(rwdh){
      this.setData({
            rwdh:rwdh
      })
    }
        this.GetUserModel();
        this.getYunmaList()
        this.GetTaskList();
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
  onHide() {
    // 页面隐藏
    this.setData({
      onPen:0
    })
  },
  onShow(){
    if(this.data.onPen==1){
      return;
    }
    // 页面显示
    this.setData({
      page:1,
    })
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
          if(this.data.rwName=='taobao'){
            this.setData({
              modalname:'taobao',
              rwName:'',
              time:'',
              times:'',
              timets:''
            });return
          }
					my.alert({
						content:'访问'+this.data.BrowseTime+'秒以上才能领取奖励哦'
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
 onReachBottom() {
			this.data.page++;
			this.GetTaskList(true)
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
   onRenderSuccess_tsrwwc(e){
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
  getYunmaList(){
        
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
  GetTaskList(concat=false){
        request('/api/v5/Activity/GetTaskList','GET',{	TaskArea:'rw&',page:this.data.page,size:this.data.size}).then(res=>{
                    if(res.success&&res.data.length>0){
                      var data=res.data;
                        this.setData({
                            noMore:false
                        })
                        if(!concat){
                          this.setData({
                            list:data
                          })
                          
                        }else{
                          var list=this.data.list.concat(data)
                          this.setData({
                            list:list
                          })
                        }
                        my.uma.trackEvent('zhibo_01',{'show':1})
                }else{
                    this.setData({
                        noMore:true,
                        page:this.data.page-1
                    })
              }
               
        })
			
			},
    //任务跳转页面
  tabNav(e){
    console.log(e)
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
                  
               my.uma.trackEvent('zhibo_01',{'click':1})
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
                  my.uma.trackEvent('zhibo_01',{'click':1})
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
						my.uma.trackEvent('zhibo_01',{'click':1})
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
						my.uma.trackEvent('zhibo_01',{'click':1})
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
						my.uma.trackEvent('zhibo_01',{'click':1})
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
           my.uma.trackEvent('zhibo_01',{'click':1})
           return;
				}
				if(JumpType==8){
					my.navigateTo({
						url:'../child/sign/sign'
					})
					return;
				}
				if(JumpType==9){
					console.log('跳转开心币明细')
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
						my.uma.trackEvent('zhibo_01',{'click':1})
					}
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink + '?BrowseTime=' + item.BrowseTime+ '&id=' + item.Id + '&jl=' + item.RewardAmount,
                   extraData:{
                    appId:"2021002135640940",
                    appName:'开心直播-超级互动城'
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
            var link ='https://d.alipay.com/?scheme=' + encodeURIComponent('alipays://platformapi/startApp?appId=2021002135640940&page=pages%2Findex%2Findex%3Fyunmaid%3D'+taskId);  // 任务完成后续跳转, 浏览商品没有  
            //link = "https%3A%2F%2Fd.alipay.com%2F%3Fscheme%3Dalipays%3A%2F%2Fplatformapi%2FstartApp%3FappId%3D2021002135640940%26page%3Dpages%2Findex%2Findex%3Fyunmaid%3D123";
            link =encodeURIComponent('alipays://platformapi/startApp?appId=2021002135640940&page=pages%2findex%2findex%3fyunmaid%3d123');  // 任务完成后续跳转, 浏览商品没有  
            const userId = '12345677';  
            const userNick= '123XXX';
            const content= item.YMJsonString.Content;
            const appId = '2021002135640940'  // 小程序ID  
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
           my.uma.trackEvent('zhibo_01',{'click':1})
           return;
        }
        if(JumpType==16){
            this.setData({
              Id:item.Id,
              templateId1:item.APPID
            })
            this.onTapBtn_rw()
             my.uma.trackEvent('zhibo_01',{'click':1})
             return;
        }
        if (JumpType==18) {
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
      sendMes(){
				request('/api/v2/Push/Push','GET',{templateId:this.data.templateId1}).then(res=>{
          console.log(res)
          if(res.success){
            this.AddReward()
          }
				})
      },
       watchTaobo(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
             console.log("当前时间戳为：" + timestamp); 
             this.setData({
                 time:timestamp,
                  modalShow:false,
                  modalname:''
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
              console.log('this.data.usercount',this.data.usercount)
                if(res.data.usercount==0){
                   my.setStorageSync({
                        key:'usercount',
                        data:1
                    })
                    this.setData({
                      usercount:1,
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
              
              
                my.uma.trackEvent('zhibo_01',{'success':1});
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
      closeModal(){
        this.setData({
          modalname:'',
          modalShow:false
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
		  watchTaobo3(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;
            this.setData({
                timets:timestamp,
                modalShow:false,
				       
            })
				    console.log("当前时间戳为：" + timestamp); 
				    
      },
});
