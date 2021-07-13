import request from '../../../http.js';

Page({
  data: {
    tabIndex:0,
    modalname:''
  },
  onLoad() {
     var userInfo= my.getStorageSync({ key: 'userInfo' }).data
    if(userInfo){
         this.setData({
            userInfo:userInfo
          })
    }
    this.GetVIPPage()
  },
  tab(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      tabIndex:index
    })
  },
  back(){
    my.switchTab({
      url: '/pages/index/index'
    });
  },
  closeModal(){
    this.setData({
      modalname:''
    })
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
   //获取会员套餐信息
  GetVIPPage(){
      request('/api/v1/Member/GetVIPPage','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          list:res.data
        })
      })
  },
  //支付
  GetOut_trade_no(){
    var that=this;
     request('/api/v1/Member/GetOut_trade_no','GET', {
       id:this.data.list[this.data.tabIndex].Id
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          payFor:res.data
        })
        if(res.success){
            my.tradePay({
                tradeNO: res.data,  
                success: function(res) {
                  console.log(res);            
                 if(res.resultCode==6001){
                      if(that.data.userInfo.data.Ispublic==1){
                           that.setData({
                            modalname:'jxzf'
                          })
                      }
                       
                    //     my.showToast({
                    //    type: 'none',
                    //   content:'您取消了支付',
                    // })
                  }else{
                    that.SaveVIP()
                  } 

                },
                fail: function(res) { 
                 
                // my.alert({
                //   content: JSON.stringify(res),
                //   });

              },
          });
        }
      })
  },
  SaveVIP(){
     request('/api/v1/Member/SaveVIP','GET', {
       out_trade_no:this.data.payFor,id:this.data.list[this.data.tabIndex].Id
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
          if(res.success==false){
              my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
          }else{
            this.setData({
              modalname:'kaitong'
            })
            this.GetUserModel()
          }
      })
  },
  buy(){
    this.GetOut_trade_no()
  }
});
