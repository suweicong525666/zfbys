import request from '../../../http.js';
const { requestSubscribeMessage } = requirePlugin('subscribeMsg');
Page({
  data: {
    onPen:0,
    targetTime1: 0,
    myFormat: ["时", "分", "秒"],
    myFormat1: ["天", "时", "分", "秒"],
    status: "进行中...",
    clearTimer: false,
    templateId1: '',
    templateId2: '',
    templateId3: '',
    modalShow:false,
    modalname:'',
    timer:'',
    downNum:0,
    show:true,
    cdShow:false,
     resourceId: "AD_20210325000000100457",
  },
   childMethods(ref){//注册子组件实例来调用子组件办法
        this.childCompoentMethod = ref
    },
  onLoad() {
    this.setData({
            targetTime: new Date().getTime() + 64300000,
            onPen:1
        });
     this.GetUserModel()
  },
 onHide(){
    this.setData({
      onPen:0
    })
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
  onShow(){
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
              this.childCompoentMethod.AddReward(this.data.Id)
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
jump_exchangeDetail(){
  my.navigateTo({
    url: '/pages/child/exchangeDetail/exchangeDetail'
  });
} ,    
   //获取用户信息
  GetUserModel(){
      request('/api/v2/User/GetUserDetail/GetUserModel','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          userInfo:res.data
        });
        this.GetActivityLotteryList()
      })
  },
  //获取红包列表
 GetActivityLotteryList(){
    request('/api/v3/Activity/GetActivityLotteryList','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          hbList:res.data,
          targetTime:new Date().getTime()+res.data[0].Time,
          cdShow:true
        })
      })
  },
 
//抽奖
choujiang(e){
  console.log(e)
  let SoldOut=e.currentTarget.dataset.SoldOut;
  let id=e.currentTarget.dataset.id;
  let quota=e.currentTarget.dataset.quota;
   request('/api/v3/Activity/GetActivityLotteryList','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        if(res.data[0].Time>0){
          my.showToast({
            content:'时间未到',
            type:'none'
          });
        }else{
          if(SoldOut==true){
                  my.showToast({
                    content:'奖励已经兑完，下次加快手速哦',
                    icon:'none'
                  });return;
                }
          if(quota<1){
               this.SaveActivityLottery(id)
          }
           
        }
      })
  
     
},
 //抽奖接口
 SaveActivityLottery(id){
    request('/api/v3/Activity/SaveActivityLottery','POST', {LotteryId:id
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
          if(res.success){
              my.showToast({
                content:'兑换成功',
                type:'success'
              });
              this.GetUserModel()
          }else{
            my.showToast({
                content:res.msg,
                type:'none'
              });
          }
      })
  },
    myLinsterner(e) {
        this.setData({
            status: "已经开始"
        });
    }
});
