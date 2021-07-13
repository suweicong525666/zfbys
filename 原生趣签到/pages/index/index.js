import request from '../../http.js';
const { requestSubscribeMessage } = requirePlugin('subscribeMsg');
Page({
  data:{
        login:false
  },
  childMethods(ref){//注册子组件实例来调用子组件办法
        this.childCompoentMethod = ref
    },
  varsion(){
       request('/api/v1/Activity/GetVersionSetting','POST',{versionNumber:'1.0.72',appletsMark:'2021002151689730'}).then(res=>{
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
          this.login()
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
           this.childCompoentMethod.AddReward(zid)
          // this.AddReward_zhuomian()
      }
      //判断是否从支付宝首页进入
      var zfbsy=my.getStorageSync({ key: 'zfbsy' }).data;
      if(zfbsy){
          this.setData({
            Id:my.getStorageSync({ key: 'sid' }).data
          })
          //请求支付宝首页进入收益
           this.childCompoentMethod.AddReward(my.getStorageSync({ key: 'sid' }).data)
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
           request('/api/v2/Login/GetAliUserSilent/GetAliUserSilent','GET',{auth_code:result.authCode,puserid:userid,appid:'2021002151689730'}).then(res=>{
             if(res.success){
                my.setStorageSync({
                      key: 'token',
                      data: res.data.access_token
                });
                console.log('后端返回个人信息',res.data.access_token);
                this.setData({
                  login:true,
                  token:res.data.access_token
                })
               
                
					}
           })
			   },
			  });
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
              my.Init.userInfo=res.data
            })
        },
  //渠道接口
  ChannelStatistics(name){
      request('/api/v1/ChannelStatistics/GetChannelStatistics','GET',{name:name}).then(res=>{

        })
  },

 

  //广告位回调
  onComplete(data) {
    console.log('广告位回调',data);
    my.alert({
      title: '任务结束',
      content: data    });
  },

      jump_Mycoin(){
        my.navigateTo({
          url:'/pages/child/exchange/exchange'
        })
      },



  onReady() {
    // 页面加载完成
  },
  onShow() {
      if(my.Init.time){
          var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
          let useTime=timestamp-my.Init.time;//计算浏览时间差
          if(useTime>=my.Init.BrowseTime){
            console.log('观看时间达到条件')
            this.childCompoentMethod.AddReward(my.Init.Id)
          }else{
              //浏览时间未达标提示
              this.childCompoentMethod.msg()
          }
          return
      }
    if(this.data.onPen==1){
        return;
    }
    // 页面显示
    var token=my.getStorageSync({ key: 'token' }).data;
    if(token){
      this.childCompoentMethod.GetUserModel();
      this.childCompoentMethod.GetTaskList();
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
  //流量位插件回调
			onCompletes(data){
        console.log('广告位回调',data)
        this.setData({
          Id:this.data.aliggList[0].Id
        })
				this.AddReward()
      },

    //查找云码任务是否关注成功
    TaskIsTrue(){
      	request('/api/v4/Activity/TaskIsTrue','GET',{keyid:this.data.keyid}).then(res=>{
					console.log('查找云码任务是否关注成功',res);
					if(res.success){
             setTimeout(()=>{
                this.childCompoentMethod.AddReward(this.data.Id)
             },500)
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
      onPen:0,
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
  onPullDownRefresh(){
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onReady(){
    setTimeout(()=>{
      this.setData({
        feedShow:true
      })
    },500)
  },
   onShareAppMessage() {
     var that=this;
			return{
				title:'趣签到-天天领现金红包',
				path:'pages/index/index?userid='+my.Init.userInfo.AliAppletOpenId,
				desc:'每天领100-200个集分宝，更有海量现金红包等你拿！',
        bgImgUrl:'/static/image/iv.jpg',
        success:function(res){
          console.log('分享成功',res);
          that.childCompoentMethod.AddReward(my.Init.fid)
        }
			}
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
  },
  saveRef(ref){
    // 将ref存起来，在想要调用的地方使用
    this.ref = ref
  },
});
