import request from '../../../http.js';
Page({
  data: {
    a: 0,
    dingshiq: '',
    cad: 0,
    onshow: false,
    id: 0,
    jl: 0
  },
  onLoad(e) {
    this.setData({
      id: e.id,
      jl: e.jl
    })
      my.setStorageSync({
        key: 'nltime',
        data: e.BrowseTime //云码id
      })    
    console.log(e, 123)
    this.rwlist()
    if (my.getStorageSync({ key: 'nltime' }).data % 2 == 0) {
      this.setData({
        int: my.getStorageSync({ key: 'nltime' }).data / 2
      })
    } else {
      this.setData({
        int: (my.getStorageSync({ key: 'nltime' }).data + 1) / 2
      })
    }
    this.setData({
      zongtims: my.getStorageSync({ key: 'nltime' }).data
    })
    this.setData({
      onPen: 1
    })
    setTimeout(() => {
      this.setData({
        onPen: 0
      }, 1000)
    })
    this.dingshiq()
  },
  onUnload() {
    // clearInterval(this.data.dingshiqi);
    // if(my.getStorageSync({key: 'djstime'}).data>=my.getStorageSync({key: 'nltime'}).data-1){
    //   my.setStorageSync({
    //     key: 'djstime',
    //     data: 0
    //   })      
    // }
  },
  dingshiq() {
    // if(my.getStorageSync({key: 'djstime'}).data){
    //   this.setData({
    //     a:my.getStorageSync({key: 'djstime'}).data
    //   })      
    // } else{
    //   this.setData({
    //     a:0
    //   })      
    // }    
    var _this = this
    var si = 100 / my.getStorageSync({ key: 'nltime' }).data
    // this.setData({
    //   cad:si*my.getStorageSync({key: 'djstime'}).data
    // })
    this.data.dingshiqi = setInterval(function () {
      if (_this.data.a == my.getStorageSync({ key: 'nltime' }).data) {
        clearInterval(_this.data.dingshiqi);
      } else {
        if (_this.data.cad >= 40) {
          _this.setData({
            onshow: true
          })
        }
        var int = _this.data.a + 1
        var li = _this.data.cad + si
        _this.setData({
          a: _this.data.a + 1,
          cad: li
        })
        // my.setStorageSync({
        //   key: 'djstime',
        //   data: int
        // })               
      }
    }, 1000);
  },
  onShow() {
    if (this.data.onPen == 0) {
      console.log('淘宝返回计算时间差')
    }


  },
  onHide() {
    console.log('开始计算时间')

    if (my.getStorageSync({ key: 'djstime' }).data == my.getStorageSync({ key: 'nltime' }).data) {
      my.setStorageSync({
        key: 'djstime',
        data: 0
      })
    }
  },
  rwlist() {
    request('/api/v1/Times/GetTimesPageList', 'GET', { taskId: this.data.id }).then(res => {
      if (res.success) {
        res.data.forEach(item => {
          item.Time = item.Time.slice(0, 5)
        });
        this.setData({
          list: res.data
        })
      }
    })
  },
  onSaveRef(ref) {
    console.log('ref', ref)
    this.feeds = ref;
  },
  onPullDownRefresh() {
    // 小程序下拉时顺便刷新feeds数据
    this.feeds && this.feeds.refresh && this.feeds.refresh();
  },
  onRenderSuccess_last(e) {
    console.log('last', e)
  },
  onRenderFail_last(e) {
    console.log('feed广告失败回调', e)
    if (e.code == 1002) {
      this.setData({
        feedShow: false
      })
    }
  }
});
