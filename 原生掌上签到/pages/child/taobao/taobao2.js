Page({
  data: {
    nowtime:0,
    timeer:'',
    int:0
  },
  onLoad(options) {
    this.setData({
      onPen:1,
      BrowseTime:options.BrowseTime
    })
    this.ontime()
  },
  ontime(){
    let timeer=this.data.timeer;
    let closeTime=this.data.BrowseTime*1000+1000
   timeer=setInterval(()=>{
     if(this.data.int==this.data.BrowseTime){
       clearInterval(timeer)
     }else{
        this.setData({
          nowtime:this.data.nowtime+1,
          int:this.data.int+1
        })       
     }

    },1000)
  },
  onShow(){
      if(this.data.onPen==0){
          console.log('淘宝返回计算时间差')
      }
  },
  onHide(){
    console.log('开始计算时间')
  },
  onSaveRef(ref) {
    console.log('ref',ref)
    this.feeds = ref;
  },
  onPullDownRefresh() {
    // 小程序下拉时顺便刷新feeds数据
    this.feeds && this.feeds.refresh && this.feeds.refresh();
  },
  onRenderSuccess_last(e){
    console.log('last',e)
  },
  onRenderFail_last(e){
    console.log('feed广告失败回调',e)
    if(e.code==1002){
      this.setData({
        feedShow:false
      })
    }
  }
});
