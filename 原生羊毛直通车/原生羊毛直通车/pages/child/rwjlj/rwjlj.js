
import request from '../../../http.js';

Page({
  data: {
    top:{
      sum:0,
      todaysum:0
    },
    list:[],
    page:1,size:10
  },
  onLoad() {
    this.GetUserMemberTaskList()
  },
   onReachBottom() {
			this.data.page++;
			this.GetUserMemberTaskList(true)
    },
   GetUserMemberTaskList(concat=false){
      request('/api/v1/Member/GetUserMemberTaskList','GET',{page:this.data.page,size:this.data.size}).then(res=>{
        console.log('res',res)
        if(res.success&&res.data.data.length>0){
          if(!concat){
             let sum="top.sum";
           let todaysum="top.todaysum";
          this.setData({
            [sum]:res.data.sum,
            [todaysum]:res.data.todaysum,
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
