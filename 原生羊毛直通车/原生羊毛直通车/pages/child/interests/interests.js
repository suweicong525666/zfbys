import request from '../../../http.js';
Page({
  data: {},
  onLoad() {
    this.GetMemberBenefitsPage()
  },
   //获取列表
  GetMemberBenefitsPage(){
      request('/api/v1/Member/GetMemberBenefitsPage','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          list:res.data
        })
      })
  },
  tabNav(e){
        let JumpType=e.currentTarget.dataset.JumpType;
        let item=e.currentTarget.dataset.item;
        var that=this;
        if(JumpType==5||JumpType==6){
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
        if(JumpType==11){
          console.log('跳转其他小程序');
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink,
                  extraData:{
                    appId:"2021002148670876",
                    appName:'淘金直通车'
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
  }
});
