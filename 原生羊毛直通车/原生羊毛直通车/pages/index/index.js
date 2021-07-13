import request from '../../http.js';
Page({
  data:{
    page:1,
    size:50,
  },
   onLoad(options) {
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
          this.login(); 
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
     
      this.setData({
        onPen:1
      })
     
    // 页面加载
  
  },
  onReady() {
    // 页面加载完成
    var that=this;
    var query = my.createSelectorQuery();
//选择id
query.select('#myText').boundingClientRect()
query.exec(function (res) {
  //res就是 所有标签为myText的元素的信息 的数组
  console.log(res);
  //取高度
  console.log(res[0].height);
  let wh=my.getSystemInfoSync().windowHeight
  console.log('wh',wh)
  that.setData({
    mainHeight:wh-res[0].height
  })
  let sysTem=my.getSystemInfoSync()
  console.log('sysTem',sysTem)
})
  },
  onShow() {
    if(this.data.onPen==1){
        this.setData({
          onPen:0
        })
        return;
    }
    this.setData({
      page:1
    })
    var token= my.getStorageSync({ key: 'token' }).data
    if(token){
      this.GetUserModel()
      this.GetTaskPage()
    }
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
    
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
    this.data.page++;
    this.GetTaskPage(true)
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
   //渠道接口
  ChannelStatistics(name){
      request('/api/v1/ChannelStatistics/GetChannelStatistics','GET',{name:name}).then(res=>{
           })
  },
   login(userid){
         var that=this;
         my.getAuthCode({
			   scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
			   success: (result) => {
      //      console.log(result);
           request('/api/v2/Login/GetAliUserSilent/GetAliUserSilent','GET',{auth_code:result.authCode,puserid:userid,appid:'2021002148670876'}).then(res=>{
             if(res.success){
                console.log('后端返回个人信息',res.data.access_token);
                my.setStorageSync({
                      key: 'token',
                      data: res.data.access_token
                });
            that.GetUserModel()
            that.getSwiper()
            that.GetTaskPage()
					}
           })
           
			   },
			  });
  },
    //获取用户信息
  GetUserModel(){
      request('/api/v1/Member/GetUserModel','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          userInfo:res.data
        })
        my.setStorageSync({
          key:'userInfo',
          data:res.data
        })
      })
  },
  //获取轮播图数据
  getSwiper(){
     request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'SY&'}).then(res=>{
					console.log('banner',res);
					if(res.success){
            let data=res.data;
            for(var i=0;i<data.length;i++){
              data[i].IsDone=true
            }
            this.setData({
              swiper:data
            })
					}
				})
  },
  //获取任务数据
  GetTaskPage(concat=false){
     request('/api/v1/Member/GetTaskPage','GET', {
        page:this.data.page,size:20
      }).then(res => {
        console.log('成功回调',res)
        if(res.success&&res.data.length>0){
                  this.setData({
                    noMore:false
                  })
                  if(!concat){
                    this.setData({
                       list:res.data
                    })
                  }else{
                    this.setData({
                      list:this.data.list.concat(res.data)
                    })
                    
                  }
            }else{
              this.setData({
                 noMore:true,
                 page:this.data.page-1
              })
            }
      })
  },
 //任务跳转
 tabNav(e){
  console.log(e)
  let index=e.currentTarget.dataset.index;
  	my.navigateToMiniProgram({
						appId:this.data.list[index].APPID,
            path:'pages/index/index?Mark=2021002148670876'+"&UserId="+this.data.userInfo.id,
            extraData:{
              appId:"2021002148670876",
              appName:'淘金直通车'
            },
						success:(res)=> {
						}
					})
 },
 //轮播图跳转
 swiperJump(e){
   console.log(e);
        let JumpType=e.currentTarget.dataset.JumpType;
        let item=e.currentTarget.dataset.item;
        var that=this;
				if(JumpType==1){
          if(item.IsDone==false){
              this.setData({
                          modalname:'life',
                          lifeImg:item.Img,
                          lifeTittle:item.Title,
                          lifeSutittle:item.Subtitle,
                          sceneId:item.Component
                    })
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
					
          }
         
					my.ap.navigateToAlipayPage({
						path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttps://api.shupaiyun.com/jumptb1.html?id='+item.Id,
						success:(res) => {
							
					    },
					    fail:(error) => {
					                
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
					
					}
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink,
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
            if(item.AliAdvertisingLink){
                my.navigateTo({
                  url:item.AliAdvertisingLink
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
            var link ='https://d.alipay.com/?scheme=' + encodeURIComponent('alipays://platformapi/startApp?appId=2021002129606766&page=pages%2Findex%2Findex%3Fyunmaid%3D'+taskId);  // 任务完成后续跳转, 浏览商品没有  
            //link = "https%3A%2F%2Fd.alipay.com%2F%3Fscheme%3Dalipays%3A%2F%2Fplatformapi%2FstartApp%3FappId%3D2021002129606766%26page%3Dpages%2Findex%2Findex%3Fyunmaid%3D123";
            link =encodeURIComponent('alipays://platformapi/startApp?appId=2021002129606766&page=pages%2findex%2findex%3fyunmaid%3d123');  // 任务完成后续跳转, 浏览商品没有  
            const userId = '12345677';  
            const userNick= '123XXX';
            const content= item.YMJsonString.Content;
            const appId = '2021002148670876'  // 小程序ID  
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
              Id:item.Id,
              templateId1:item.APPID
            })
            this.onTapBtn_rw()
            
        }
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
    jump_kthy(){
       my.navigateTo({
        url: '/pages/child/kthy/kthy'
      })
    },
    click_hb(){
      if(this.data.userInfo.count<this.data.list.length){
           my.showToast({
            type: 'none',
            content: '完成全部任务后,现金红包自动到账',
          });
      }else{
         my.showToast({
            type: 'none',
            content: '现金红包已到账',
          });
      }
    }
});
