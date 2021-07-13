import request from '../../../http.js';
Page({
  data: {},
  onLoad() {
     var userInfo= my.getStorageSync({ key: 'userInfo' }).data
    if(userInfo){
         this.setData({
            userInfo:userInfo
          })
        if(userInfo.data.Ispublic==1){
            this.setData({
              modalname:'hyzx'
            })
        } 
    }
    this.GetInvitationPage()
  },
  jump_kt(){
    my.navigateTo({
      url: '/pages/child/kthy/kthy'
    });
  },
  closeModal(){
    this.setData({
      modalname:''
    })
  },
  GetInvitationPage(){
    	request('/api/v1/Member/GetInvitationPage','GET',{page:1,size:10}).then(res=>{
          console.log(res)
           this.setData({
            rankList:res.data
        })
				})
  },
  onShareAppMessage() {
			return{
				title:'淘金直通车-天天领现金红包',
				path:'pages/index/index?userid='+this.data.userInfo.data.AliAppletOpenId,
				desc:'每天领100-200个集分宝，更有海量现金红包等你拿！',
				bgImgUrl:'/static/image/iv.jpg'
			}
    },
  
});
