import request from '../../../http.js';
const { requestSubscribeMessage } = requirePlugin('subscribeMsg');
Page({
  data: {
    isLoad:true,
    ptrwwcShow:true,
     onPen:0,
    list:[],
    show:true,
    page:1,
    size:30,
    modalShow:false,
    modalname:'',
    templateId1:''
  },
  childMethods(ref){//注册子组件实例来调用子组件办法
        this.childCompoentMethod = ref
    },
  onLoad() {
     var verShow= my.getStorageSync({ key: 'verShow' }).data
    if(verShow){
         this.setData({
            verShow:true
          })
    }
    var alBanShow= my.getStorageSync({ key: 'alBanShow' }).data
    if(alBanShow){
         this.setData({
            alBanShow:true
          })
    }
     var rwTs= my.getStorageSync({ key: 'rwTs' }).data
    if(rwTs){
         this.setData({
            rwTs:rwTs
          })
    }
     var rwdh= my.getStorageSync({ key: 'rwdh' }).data
    if(rwdh){
         this.setData({
            rwdh:rwdh
          })
    }
    this.setData({
      onPen:1
    })
  },
  onHide() {
    // 页面隐藏
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
    if(this.data.onPen==1){
      return;
    }
     if(my.Init.time){
          var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
          let useTime=timestamp-my.Init.time;//计算浏览时间差
          if(useTime>=my.Init.BrowseTime){
            console.log('观看时间达到条件')
            this.childCompoentMethod.AddReward_all(my.Init.Id)
          }else{
              //浏览时间未达标提示
              this.childCompoentMethod.msg()
          }
          return
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
 onReachBottom() {
      this.data.page++;
      this.setData({
        isLoadOpen:true,
        isLoad:true
      })
			this.GetTaskList(true)
  },
  GetTaskList(concat=false){
        request('/api/v5/Activity/GetTaskList','GET',{	TaskArea:'rw&',page:this.data.page,size:this.data.size}).then(res=>{
                    if(res.success&&res.data.length>0){
                          this.childCompoentMethod.allTaskList(res.data);
                }else{
                    my.Init.isLoad=false;
                    this.setData({
                        isLoad:false,
                        page:this.data.page-1
                    })
              }
               
        })
			 
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
    
});
