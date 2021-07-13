import request from '../../http.js';
Page({
  data: {
    modalShow:false,
    modalname:''
  },
   childMethods(ref){//注册子组件实例来调用子组件办法
        this.childCompoentMethod = ref
    },
  // test(){
  //   my.tradePay({
  //               tradeNO:'2021070122001472691433126778',  
  //               success: function(res) {
  //                 console.log(res);            
  //                if(res.resultCode==6001){
  //                       my.showToast({
  //                      type: 'none',
  //                     content:'您取消了支付',
  //                   })
  //                 }else{
  //                   that.SaveVIP()
  //                 } 

  //               },
  //               fail: function(res) { 
                 
  //               // my.alert({
  //               //   content: JSON.stringify(res),
  //               //   });

  //             },
  //         });
  // },
  onLoad() {
     var verShow= my.getStorageSync({ key: 'verShow' }).data
    if(verShow){
         this.setData({
            verShow:true
          })
    }
    this.login()          
  },
  login(){
    var that=this;
    my.getAuthCode({
         scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
         success: (result) => {
           console.log(result);
            request('/api/v2/Login/GetAliUser/GetAliUser','GET',{auth_code:result.authCode,puserid:this.data.userid?this.data.userid:'',appid:'2021002151689730'}).then(res=>{
             if(res.success){
                console.log('后端返回个人信息',res.data.access_token);
                my.setStorageSync({
                      key: 'token',
                      data: res.data.access_token
                });
						that.GetUserModel()
					}
           })
         },
        fail:(res)=>{
          console.log('fail',res.error)
          if(res.error==11){
              console.log('用户拒绝授权')
          }
        }
      });
  },
  onShow(){
    this.GetUserModel()
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
  },
 
   //获取用户信息
  GetUserModel(){
      request('/api/v2/User/GetUserDetail/GetUserModel','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          userInfo:res.data
        });
      })
  },
  
  jump_myCoin(){
     my.navigateTo({
      url: '/pages/child/myCoin/myCoin'
    });
  },
  jump_balance(){
    my.navigateTo({
      url: '/pages/child/balance/balance'
    });
  },
  //跳转建议反馈二级页面
			jump_feedBack(){
				my.navigateTo({
					url:'../child/feedback/feedback'
				})
			},
			//跳转抽奖记录二级页面
			jump_luckdraw(e){
        let index=e.currentTarget.dataset.index;
				my.navigateTo({
					url:'../child/luckdraw/luckdraw?tabIndex='+index
				})
				
			},
			//跳转我的反馈二级页面
			jump_myFeedback(){
				my.navigateTo({
					url:'../child/myFeedback/myFeedback'
				})
      },

     

  onReady(){
          setTimeout(()=>{
            this.setData({
              feedShow:true
            })
          },500)
  },
});
