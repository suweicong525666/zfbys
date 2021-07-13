Page({
  data: {},
  onLoad() {
    this.setData({
      onPen:1
    })
    setTimeout(()=>{
      this.setData({
      onPen:0
    },1000)
    })
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
