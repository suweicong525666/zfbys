import request from '../../http.js';
const { requestSubscribeMessage } = requirePlugin('subscribeMsg');

Page({
  data:{
        istongther:false,//防止重复请求
        onPen:0,
        runNum:0,
        resourceId: "AD_20210521000000100691",
				  // resourceId: "ad_tiny_2021002145669883_202103172200007828",
				userInfo:'',
				timer :'',
				animationData: {},
				topList:'',
				top_r_bList:'',
				navList:[],
				dotStyle: true,
				userid:'',
				taskid:'',
				auth_code:'',
				BrowseTime:'',//规定的条件时间数
				time:'',//观看时间秒数，
				Id:'',
				jumpLink:'',
				modalShow:false,
				modalname:'',
				RewardAmount:'',
				modalType:'',
				rwlist:'',
				show:true,
				checkFollow: false,
				syalggList:'',//阿里普通广告
				tsrwggList:'',//阿里特殊广告
				aliggList:'',
				ggHeight:0,
				scrollTop:0,
				adTask:false,
				sceneId:'',//生活号id
				lifeImg:'',
				lifeTittle:'',
        lifeSutittle:'',
        onRenderSuccess:'',
        bottomLists:[],
        topListS:[],
        ymrwList:[],
        templateId1:''
  },
   varsion(){
       request('/api/v1/Activity/GetVersionSetting','POST',{versionNumber:'1.0.72',appletsMark:'2021002145669883'}).then(res=>{
                    if(res.success){
                       console.log(res)
                       if(res.data.IsAdver==1){
                         this.setData({
                           verShow:true
                         })
                            my.setStorageSync({
                              key: 'verShow',
                              data:true
                            })
                       }else{
                          this.setData({
                           verShow:false
                         })
                           my.removeStorageSync({
                            key: 'verShow',
                          });
                       }
              }
           })
  },
  onLoad(options) {
    this.varsion();
    //引流渠道进入
    console.log('options',options)
    if(options.channel){
        this.setData({
          channel:options.channel
        })
        var channel=options.channel;
         console.log('有渠道参数',channel);
         this.ChannelStatistics(options.channel)
    }
    if(options.userid){
        //获取二维码参数
        this.setData({
            userid:options.userid,
				    taskid:options.taskId
        })
        this.login(options.userid);
      }else{
            var that=this;
            my.getAuthCode({
                 scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
                 success: (result) => {
              //      console.log(result);
                  request('/api/v2/Login/GetAliUserSilent/GetAliUserSilent','GET',{auth_code:result.authCode,appid:'2021002145669883'}).then(res=>{
                    if(res.success){
                        console.log('后端返回个人信息',res.data.access_token);
                        my.setStorageSync({
                              key: 'token',
                              data: res.data.access_token
                        });
                    that.GetUserModel()
                    that.GetTaskList();
                    that.GetYunMa()
                     //授权获取步数
                  that.getRunData()
              }
           })
           
			   },
			  });
      }

       if(options.Mark){
          my.setStorageSync({
            key:'Mark',
            data:options.Mark
          })
          my.setStorageSync({
            key:'UserId',
            data:options.UserId
          })
          this.setData({
            Mark:options.Mark,
            UserId:options.UserId
          })
     }else{
           my.setStorageSync({
              key:'Mark',
              data:''
            })
            my.setStorageSync({
              key:'UserId',
              data:0
            })
      }

      if(options.type){
        //收藏
				if(options.type=='s'){
					this.Id=my.getStorageSync({ key: 'Id' }).data
					this.AddReward()
				}
      }
     //判断是否添加桌面入口
      var zhuomianShow=my.getStorageSync({ key: 'zhuomianShow' }).data;
      if(zhuomianShow){
          //请求桌面进入收益
         var zid=my.getStorageSync({ key: 'zid' }).data;
            this.setData({
              Id:zid
            })
          this.AddReward()
      }
      //判断是否从支付宝首页进入
      var zfbsy=my.getStorageSync({ key: 'zfbsy' }).data;
      if(zfbsy){
          this.setData({
            Id:my.getStorageSync({ key: 'sid' }).data
          })
          //请求支付宝首页进入收益
          this.AddReward()
      }
      if(options.appid){
           my.navigateToMiniProgram({
                  appId: options.appid,
                  path: options.path,
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
             }); 
      }
      if(options.yunmaid){
          // my.alert({
          //   content:'关注成功1,'+options.yunmaid
          // })
      }
     
    // 页面加载
    this.setData({
      onPen:1
    })
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
  login(userid){
         var that=this;
         my.getAuthCode({
			   scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
			   success: (result) => {
      //      console.log(result);
           request('/api/v2/Login/GetAliUserSilent/GetAliUserSilent','GET',{auth_code:result.authCode,puserid:userid,appid:'2021002145669883'}).then(res=>{
             if(res.success){
                console.log('后端返回个人信息',res.data.access_token);
                my.setStorageSync({
                      key: 'token',
                      data: res.data.access_token
                });
						that.GetUserModel()
            that.GetTaskList()
            that.GetYunMa()
          //授权获取步数
            that.getRunData()
					}
           })
           
			   },
			  });
  },
//渠道接口
  ChannelStatistics(name){
      request('/api/v1/ChannelStatistics/GetChannelStatistics','GET',{name:name}).then(res=>{
           })
  },
//点击兑换按钮
click_duihuan(){
  if(!this.data.runShow){
      this.getRunData()
    return;
  }
  if(this.data.runNum<100){
      my.showToast({
        content:'最低兑换100步'
      });return;
  }
  if(!this.data.istongther){
     this.getRunDataApi2(this.data.runNum)
  }
 
},
  //授权获取步数
  getRunData(){
      my.showLoading({
        content:'加载中'
      });
      var myDate = new Date();
      var year=myDate.getFullYear();
      var month=myDate.getMonth()+1;
      if(month<10){
          month='0'+month
      }
      var day=myDate.getDate()
       if(day<10){
          day='0'+day
      }
     var today= myDate.toLocaleDateString()
      var today_=today.replace(/\//g, '-');
       console.log('当前时间：',year+'-'+month+'-'+day)
       my.getRunData({
  countDate:year+'-'+month+'-'+day,
  fail: (res) => {
    console.log('get pedometer encrypted fail:'+JSON.stringify(res))
    if(res.error==1003){
        my.confirm({
      title: '提示',
      content: '取消授权,可能会部分服务无法使用,或者页面信息不完整',
      confirmButtonText: '我知道了',
      cancelButtonText: '重新授权',
      success: (result) => {
        console.log(result)
        if(result.confirm==false){
            this.getRunData();
        }
      },
    });
    }
  },
  success: (res) => {
    let that = this;
    console.log('get pedometer encrypted success:'+JSON.stringify(res))
      this.getRunDataApi(res.response)
  },
  complete: (res) => {
    console.log('getRunData complete:' + JSON.stringify(res))
  }
})
},
//获取的步数加密后端转换
getRunDataApi(str){
     request('/api/v4/Activity/GetStepCount','POST',{str:str}).then(res=>{
             if(res.success){
               this.setData({
                 runShow:true,
                 runNum:res.data.count-res.data.steps
               })
					}
           })
},
//步数接口
getRunDataApi2(step){
  var that=this;
   console.log('步数结果返回9999')
   this.setData({
     istongther:true
   })
     request('/api/v3/User/SaveStepMoney','GET',{step:step}).then(res=>{
             if(res.success){
             console.log('步数结果返回',res)
             this.getRunData();
             this.setData({
                runNums:res.data.steps,
               coin:res.data.coin,
               modalname:'duihuan'
             })
					}
           })
            setTimeout(function(){
          that.setData({
            isTogether:false
          })
       },5000)
},
  closeModal(){
    this.setData({
      modalShow:false,
      modalname:''
    })
  },
  onRenderSuccess(e){
    console.log('阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            alBanShow:true
          })
          my.setStorageSync({
            key:'alBanShow',
            data:true
          })
    }else{
       this.setData({
            alBanShow:false
          })
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
     console.log('特殊任务完成阿里图片广告加载成功',e)
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
  onRenderFail(e){
    console.log('阿里图片广告加载失败',e)
  },
  jump_allTasks(){
    my.navigateTo({
      url:'/pages/child/allTasks/allTasks'
    })
  },
  //广告位回调
  onComplete(data) {
    console.log('广告位回调',data);
    my.alert({
      title: '任务结束',
      content: data    });
  },
  //获取用户信息
  GetUserModel(){
      request('/api/v2/User/GetUserDetail/GetUserModel','GET', {issum:1
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          userInfo:res.data
        })
      })
  },
  //云码数据获取
  GetYunMa(){
     request('/api/v5/Activity/GetYMTaskList','GET',{TaskArea:'rw&'}
              ).then(result=>{
                if(result.success){
                  var topListS=this.data.topListS;
                    var nowList=result.data;
                    console.log('789',topListS.qp)
                    var qp=this.data.topListS.qp;
                   
                     for(var i=0;i<nowList.length;i++){
                          nowList[i].YMJsonString=JSON.parse(nowList[i].YMJsonString)
                          qp.unshift(nowList[i]);
                      }
                      topListS.qp=qp;
                  if(result.data.length > 0){
                     this.setData({
                        ymrwList:nowList,
                         topListS:topListS
                      }) 
                  }
                }
              })
                //恭喜您获得额外福利，点击下方广告浏览，直接领取0.01元完成后第一次显示特殊广告
         request('/api/v5/Activity/GetHBJHList','GET',{TaskArea:'ptrwwchalggtc'},
              ).then(res=>{
                if(res.success){
                  var nowList=res.data
                   for(var i=0;i<nowList.ym.length;i++){
                          nowList.ym[i].YMJsonString=JSON.parse(nowList.ym[i].YMJsonString)
                      }
                       for(var j=0;j<nowList.list.length;j++){
                          nowList.list[j].IsDone=false
                      }
                  this.setData({
                    rwTs:nowList
                  })
                  my.setStorageSync({
                    key:'rwTs',
                    data:nowList
                  })
                }
              })
                 //点击普通显示的灯火广告
         request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'ptrwalggtc'},
              ).then(res=>{
                if(res.success){
                  this.setData({
                    rwdh:res.data.ts
                  })
                   my.setStorageSync({
                    key:'rwdh',
                    data:res.data.ts
                  })
                }
              }) 
  },
  //获取首页展示的数据（气泡区-导航区-任务区）
  GetTaskList(){
        request('/api/v5/Activity/GetTaskList','GET',{}
				 ).then(res=>{
					 if(res.success){
             var data=res.data;
               this.setData({
               usercount:res.data.usercount
             })
              my.setStorageSync({
               key:'usercount',
               data:res.data.usercount
             })
             for(var i=0;i<data.dh.length;i++){
                data.dh[i].IsDone=true
             }
             if(this.data.ymrwList.length>0){
                var ymrwList=this.data.ymrwList
                for(var i=0;i<ymrwList.length;i++){
                          data.qp.unshift(ymrwList[i]);
                }
                this.setData({
                  topListS:data
                })
             }else{
                 this.setData({
                  topListS:data
                })
             }
            
					 }
         })


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
        
			

        
        
        	//灯火广告提示框
        request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'syaligg'},
				).then(syaligg=>{
					if(syaligg.success){
             this.setData({
               syalggList:syaligg.data.ts
             })
					}
        })
        //特殊广告（浏览几秒获得奖励）
         request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'tsrwgg'},
				).then(tsrwgg=>{
					if(tsrwgg.success){
            this.setData({
               tsrwggList:tsrwgg.data.ts
             })
					}
        })
        //阿里广告提示框
         request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'aligg&'},
              ).then(aligg=>{
                if(aligg.success){
                  this.setData({
                    aliggList:aligg.data.ts
                  })
                }
              })
      },
      jump_Mycoin(){
        my.navigateTo({
          url:'/pages/child/myCoin/myCoin'
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
                  time:timestamp
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
       //桌面增加金币/集分宝接口
			 AddReward_zhuomian(){
         var that=this;
         var zid=my.getStorageSync({ key: 'zid' }).data;
          request('/api/v5/Activity/AddReward','POST',{taskId: zid}).then(res=>{
            if(res.success){
                console.log('增加金币成功')
                console.log(res);
                my.removeStorageSync({
                  key: 'zid',
                });
                my.removeStorageSync({
                key: 'zhuomianShow',
              });
                setTimeout(()=>{
                  that.GetTaskList();
                },1000)
                this.setData({
                    modalname:'',
                    time:'',
                    Id:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:true
                })
                my.uma.trackEvent('zoulu_02',{'success':1});
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
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
      //点击阿里广告第一次
			jump_banner(e){
        console.log('e',e);
        let num=e.currentTarget.dataset.num;
         let modalInfo=e.currentTarget.dataset.modalInfo;
          let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo)
				if(this.data.userInfo.NumberCompletions>=num&&modalInfo==false){
          console.log('有收益');
          this.setData({
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
				     
            })
				    console.log("当前时间戳为：" + timestamp); 
				    
      },
			//点击阿里广告第二次
			jump_bannerSecond(e){
        let num=e.currentTarget.dataset.num;
         let modalInfo=e.currentTarget.dataset.modalInfo;
          let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo)
				if(this.data.userInfo.NumberCompletions>=num&&modalInfo==false){
          console.log('有收益');
          this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
          })
					this.watchTaobo()
				}
      },
      lifeClose(){
        this.setData({
          modalname:'life'
        })
      },
      //modal子组件传值过来
      hidetest: function(info){ 
        console.log("获取组件传递的值：", info);
        if(info.close==0){
            this.setData({
              modalname:''
            })
        }
      },
 
  onShow() {
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
          //   timets:''
          // })
        }
         return;
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
  hongbao_close(){
    this.setData({
      modalname:''
    })
  },
  //流量位插件回调
			onCompletes(data){
        console.log('广告位回调',data)
        this.setData({
          Id:this.data.aliggList[0].Id
        })
				this.AddReward()
      },
      //获取阿里广告接口
			 GetAdvertList(){
        //  request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'SY&'}).then(res=>{
				// 	console.log('banner',res);
				// 	if(res.success){
        //     this.setData({
        //       syBanner:res.data
        //     })
				// 	}
				// })
				request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'rwwc&'}).then(res=>{
					console.log('banner',res);
					if(res.success){
            this.setData({
              rwBanner:res.data
            })
					
					}
				})
				request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'SYTS'}).then(res=>{
					console.log('banner',res);
					if(res.success){
            this.setData({
                syTsBanner:res.data
            })
						
					}
				})
      },
    yunma(){
      request('/api/v1/Test/Myun','GET',{}).then(res=>{
					if(res.success){
            this.setData({
                yunmaList:res.data
            })
						
					}
				})
    },
    yunmaJupm(e){
        console.log(e)
        const taskType = e.currentTarget.dataset.tasktype;  
        const alipayOpenId = this.data.userInfo.AliAppletOpenId;  
        const taskId = e.currentTarget.dataset.taskid;;   
        const channel =item.YMJsonString.Channel;  // 测试时为test , 生产时候为 channelId(向产品索取)  
        var link ='https://d.alipay.com/?scheme=' + encodeURIComponent('alipays://platformapi/startApp?appId=2021002145669883&page=pages%2Findex%2Findex%3Fyunmaid%3D123');  // 任务完成后续跳转, 浏览商品没有  
         //link = "https%3A%2F%2Fd.alipay.com%2F%3Fscheme%3Dalipays%3A%2F%2Fplatformapi%2FstartApp%3FappId%3D2021002145669883%26page%3Dpages%2Findex%2Findex%3Fyunmaid%3D123";
         link =encodeURIComponent('alipays://platformapi/startApp?appId=2021002145669883&page=pages%2findex%2findex%3fyunmaid%3d123');  // 任务完成后续跳转, 浏览商品没有  
        const userId = '12345677';  
        const userNick= '123XXX';
        const content= e.currentTarget.dataset.content;
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
          
         // https://market.m.taobao.com/app/retail-shop/rax-pi/pages/weex?wh_weex=true&pagePath=custom-1613618069764.htm&sellerId=2791424107&pageId=183375&shopId=0&bizCode=mcloud&extParams=%7B%22spm_cnt%22%3A%22mcloud.mc-183375%22%2C%22spma%22%3A%22mcloud%22%2C%22spmb%22%3A%22mc-183375%22%7D&nodeId=7fd2cf2d&contentId=null
          //&taskType=5&alipayOpenId=2088512173572694&taskId=1620635876722049
          //&channel=test
          //&link=https%3A%2F%2Fd.alipay.com%2F%3Fscheme%3Dalipays%3A%2F%2Fplatformapi%2FstartApp%3FappId%3D2021002145669883%26page%3Dpages%252findex%252findex%253fyunmaid%253d123

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
  onHide() {
    // 页面隐藏
     this.setData({
      onPen:0
    })
  },
  onUnload() {
    // 页面被关闭
     this.setData({
      onPen:0
    })
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
			return{
				title:'掌上步数-天天领现金红包',
				path:'pages/index/index?userid='+this.data.userInfo.AliAppletOpenId,
				desc:"每天领100-200个集分宝，更有海量现金红包等你拿！",
				bgImgUrl:'/static/image/fx.webp'
			}
    },
    onReady(){
     setTimeout(()=>{
      this.setData({
        feedShow:true
      })
    },500)
  },
     onSaveRef(ref) {
    this.feeds = ref;
  },
  onPullDownRefresh() {
    // 小程序下拉时顺便刷新feeds数据
    this.feeds && this.feeds.refresh && this.feeds.refresh();
  },
  onRenderSuccess_last(e){
    console.log('last',e)
  },
  onRenderFail_last(e){
    console.log('feed广告失败回调',e)
    if(e.code==1002){
      this.setData({
        feedShow:false
      })
    }
  }
});
