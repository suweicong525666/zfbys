class init {
	constructor() {
    this.name='swc';
    this.time='';//普通任务时间
    this.timets=''//特殊任务时间
    this.bottomLists='';
    this.Id='';
    this.fid='';//分享id
    this.BrowseTime='';
    this.ymrwList='';
    this.isLoad=true;
  }
  tabNav(){
    this.time='1'
  }




  //普通任务跳转
  tabNav2(JumpType,item,alBanShow,rwdhLength){
    console.log('跳转类型',JumpType);
    console.log('当前条数信息',item);
    var that=this;
     return new Promise((resolve,reject)=>{
    if(!item.IsDone){
      console.log('未完成')
       var that=this;
        var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
             console.log("当前时间戳为：" + timestamp); 
              var obj={};
              obj.timestamp=timestamp;
              obj.Id=item.Id
              obj.BrowseTime=item.BrowseTime,
             
             this.time=timestamp
            console.log(this.time)
            return;
         
    }
     console.log('1324123123')
				if(JumpType==1){
          	console.log('关注生活号')
          if(item.IsDone==false){
              this.setData({
                          modalname:'life',
                          lifeImg:item.Img,
                          lifeTittle:item.Title,
                          lifeSutittle:item.Subtitle,
                          sceneId:item.Component
                    })
               my.uma.trackEvent('renwu_02',{'click':1})
          }
					return;
        }
				if(JumpType==2){
              console.log('收藏小程序')
              my.setStorageSync({
                          key: 'Id',
                          data: item.Id
                });
                if(item.IsDone==false){
                  my.uma.trackEvent('renwu_02',{'click':1})
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
						my.uma.trackEvent('renwu_02',{'click':1})
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
          console.log('关注直播间')
					my.uma.trackEvent('renwu_02',{'click':1})
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
          console.log('生活号文章-h5-618')
          //生活号文章-h5
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
           my.uma.trackEvent('renwu_02',{'click':1})
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
						my.uma.trackEvent('renwu_02',{'click':1})
					}
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink,
                  extraData:{
                    appId:"2021002129606766",
                    appName:'开心赚点'
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
            const appId = '2021002129606766'  // 小程序ID  
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
           my.uma.trackEvent('renwu_02',{'click':1})
           return;
        }
        if(JumpType==16){
            this.setData({
              Id:item.Id,
              templateId1:item.APPID
            })
            this.onTapBtn_rw()
             my.uma.trackEvent('renwu_02',{'click':1})
        }


    	   
    })
  }
  watchTaobo(){
			
      }
  test(){
    console.log('12121212');
  }
	//静默授权
	auth_base(){
		return new Promise((resolve,reject)=>{
			uni.getAuthCode({
			   scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
			   success: (result) => {
			     console.log(result);
					resolve(result)
			   },
			  });
		})
			
	}
	//主动授权
	auth_user(){
		return new Promise((resolve, reject)=>{
			uni.getSetting({
			   success(res) {
				   console.log('授权状态',res)
			     if (!res.authSetting.userInfo) {
			               //这里调用授权
			               console.log("当前未授权");
						   uni.getAuthCode({
						      scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
						      success: (result) => {
						        console.log(result);
						   		resolve(result)
						      },
						     });
			             } else {
			               //用户已经授权过了
			               console.log("当前已授权");
						   resolve('success')
			             }
			   }
			})
		})
		
	}
	
}
const Init = new init();
export {
	Init
}