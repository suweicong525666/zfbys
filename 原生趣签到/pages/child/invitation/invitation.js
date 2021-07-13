import request from '../../../http.js';
Page({
  data: {
        list:'',
				userInfo:'',
				tabList:['本月榜单','本周榜单'],
				tabIndex:0,
				taskid:'',
				rankList:''
  },
  onLoad(options) {
    if(options.taskid){
        this.setData({
            taskid:options.taskid
        })
			}
			this.GetUserModel()
			this.GetTaskList();
			this.GetRankingVersion()
  },
  onShareAppMessage() {
			return{
				title:'趣签到-天天领现金红包',
				path:'pages/index/index?userid='+this.data.userInfo.AliAppletOpenId+'&taskId='+this.data.taskid,
				desc:'每天领100-200个集分宝，更有海量现金红包等你拿！',
				bgImgUrl:'/static/image/fx.webp'
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
        })
      })
  },
  jump_invitationRules(){
				my.navigateTo({
					url:'../inviteRules/inviteRules'
				})
    },
    GetTaskList(){
    request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{
      JumpType:10
    }).then(res=>{
        this.setData({
            list:res.data
        })
      
    })
  },
  //获取排行榜数据
    GetRankingVersion(){
      console.log('加载中')
      request('/api/v2/User/GetRankingVersion/GetRankingVersion','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      page:1,size:10,Type:this.data.tabIndex+1
      }).then(res => {
      console.log('成功回调',res)
        this.setData({
            rankList:res.data
        })
      })
  },
  tab(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      tabIndex:index
    })
    
    my.showLoading({
      content:'加载中'
    })
    this.GetRankingVersion()
  }
});
