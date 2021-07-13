import 'umtrack-alipay';
import "./__antmove/component/componentClass.js";
App({
  umengConfig:{
    appKey:'6094f2d0c9aacd3bd4c75c0d',//由友盟分配的APP_KEY
    debug:true,//是否打开调试模式
    uploadUserInfo:false,// 自动上传用户信息，设为false取消上传，默认为false
    enableVerify:false//2.4.11及以上版本打开也不会调用剪切版；
//2.4.11及以下版本，请注意线上版本关闭参数，否则会在线上调用剪切板
},
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
  },
  onShow(options) {
        if(options.scene){
          if(options.scene==1023){
                console.log('从桌面进入')
               my.setStorageSync({
                          key: 'zhuomianShow',
                          data: 'success'
                });
                return;
          }
          if(options.scene==1000){
                console.log('从支付宝首页进入')
               my.setStorageSync({
                          key: 'zfbsy',
                          data: 'success'
                });
                return;
          }
       }
    
            const updateManager = my.getUpdateManager()

            updateManager.onCheckForUpdate(function (res) {
              // 请求完新版本信息的回调
              console.log(res.hasUpdate)
            })

            updateManager.onUpdateReady(function () {
              my.confirm({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })

            updateManager.onUpdateFailed(function () {
              // 新版本下载失败
            })
  },
});
