import request from '../../http.js';
Page({
  data: {ggIndex:0},
  onLoad() {
     
    this.login() 
  },
  onShow(){
     var userInfo= my.getStorageSync({ key: 'userInfo' }).data
    if(userInfo){
         this.setData({
            userInfo:userInfo
          })
    };
    this.GetUserModel()
  },
   login(){
    var that=this;
    my.getAuthCode({
         scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
         success: (result) => {
           console.log(result);
            request('/api/v2/Login/GetAliUser/GetAliUser','GET',{auth_code:result.authCode,puserid:this.data.userid?this.data.userid:'',appid:'2021002148670876'}).then(res=>{
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
  //提现接口
  Withdraw(){
    if(this.data.userInfo.money==0){
        my.showToast({
          type:'none',
          content:'余额不足'
        })
        return;
    }
     request('/api/v1/Member/Withdraw','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
          if(res.success){
              my.showToast({
                type: 'success',
                content: '提现成功',
              });
              this.GetUserModel()
          }else{
            my.showToast({
              type: 'none',
              content: res.data.msg,
            })
          }
      })
  },
   jump(e){
    console.log(e)
    let index=e.currentTarget.dataset.index;
    if(index==0){
      my.navigateTo({
        url: '/pages/child/rwjlj/rwjlj'
      });return;
    }
    if(index==1){
      my.navigateTo({
        url: '/pages/child/yqjlj/yqjlj'
      });return;
    }
    if(index==2){
      my.navigateTo({
        url: '/pages/child/kthy/kthy'
      });return;
    }
    if(index==3){
      my.navigateTo({
        url: '/pages/child/invitation/invitation'
      });return;
    }
  },
  	//跳转我的反馈二级页面
			jump_myFeedback(){
       
				my.navigateTo({
					url:'/pages/child/myFeedback/myFeedback'
				})
      },
       //跳转建议反馈二级页面
			jump_feedBack(){
         console.log('12')
				my.navigateTo({
					url:'/pages/child/feedback/feedback'
				})
      },
      //权益弹窗
      vipJump(e){
        let index=e.currentTarget.dataset.index;
        if(index==0||index==1){
             this.setData({
              modalname:'qygg',
              ggIndex:index
            });return
        }
        if(index==2){
            my.navigateTo({
              url:'/pages/child/invitation/invitation'
            });return
        } 
        if(index==3){
            my.navigateTo({
              url:'/pages/child/interests/interests'
            });return
        } 
       
      },
      closeModal(){
        this.setData({
          modalname:''
        })
      },
      huiyuan(){
        my.navigateTo({
          url: '/pages/child/kthy/kthy'
        });
      }
});
