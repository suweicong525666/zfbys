import request from '../../../http.js';
const { requestSubscribeMessage } = requirePlugin('subscribeMsg');
Page({
  data:{
    

  },
   childMethods(ref){//注册子组件实例来调用子组件办法
        this.childCompoentMethod = ref
    },
  onLoad(options){
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
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
      // 页面显示
    var token=my.getStorageSync({ key: 'token' }).data;
    if(token){
      this.childCompoentMethod.GetTaskList();
    }
      //判断云码是否关注成功
      var taskid=my.getStorageSync({ key: 'taskid' }).data
      if(taskid){
          this.setData({
            keyid:my.getStorageSync({ key: 'taskid' }).data,//云码id
            Id:my.getStorageSync({ key: 'id' }).data//列表id
          })
          this.TaskIsTrue()
      }
  },
    //查找云码任务是否关注成功
    TaskIsTrue(){
      	request('/api/v4/Activity/TaskIsTrue','GET',{keyid:this.data.keyid}).then(res=>{
					console.log('查找云码任务是否关注成功',res);
					if(res.success){
              this.AddReward()
					}else{
            my.alert({
              content:'需要完成任务,才能领取奖励'
            })
             my.removeStorageSync({
                    key: 'id',
                  });
            my.removeStorageSync({
              key: 'taskid',
            });
          }
				})
    },
  onHide() {
    // 页面隐藏
    this.setData({
      onPen:0,
    })
  },
  onUnload() {
    // 页面被关闭
     this.setData({
      onPen:0
    })
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
 onShareAppMessage() {
     var that=this;
			return{
				title:'趣签到-天天领现金红包',
				path:'pages/index/index?userid='+my.Init.userInfo.AliAppletOpenId,
				desc:'每天领100-200个集分宝，更有海量现金红包等你拿！',
        bgImgUrl:'/static/image/iv.jpg',
        success:function(res){
          console.log('分享成功',res);
          that.childCompoentMethod.AddReward(my.Init.fid)
        }
			}
    },
});
