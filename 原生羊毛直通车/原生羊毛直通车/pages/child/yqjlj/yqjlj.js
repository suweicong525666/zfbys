import request from '../../../http.js';

Page({
  data: {
    top:{
      yaoqing:0,
      yongjin:0
    },
    list:[],
    page:1,size:10
  },
  onLoad() {
    this.GetUserMemberInvitationList()
  },
   onReachBottom() {
			this.data.page++;
			this.GetUserMemberInvitationList(true)
    },
   GetUserMemberInvitationList(concat=false){
      request('/api/v1/Member/GetUserMemberInvitationList','GET',{page:this.data.page,size:this.data.size}).then(res=>{
        console.log('res',res)
        if(res.success&&res.data.data.length>0){
          if(!concat){
             let yaoqing="top.yaoqing";
           let yongjin="top.yongjin";
          this.setData({
            [yaoqing]:res.data.yaoqing,
            [yongjin]:res.data.yongjin,
            list:res.data.data
          })
          }else{
             this.setData({
                      list:this.data.list.concat(res.data.data)
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
});
