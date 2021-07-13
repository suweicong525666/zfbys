if(!self.__appxInited) {
self.__appxInited = 1;
require('@alipay/appx-compiler/lib/sjsEnvInit');

require('./config$');


      function getUserAgentInPlatformWeb() {
        return typeof navigator !== 'undefined' ? navigator.swuserAgent || navigator.userAgent || '' : '';
      }
      if(getUserAgentInPlatformWeb() && (getUserAgentInPlatformWeb().indexOf('LyraVM') > 0 || getUserAgentInPlatformWeb().indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}

if(AFAppX.compilerConfig){ AFAppX.compilerConfig.component2 = true; }

function success() {
require('../../app');
require('../../components/modal/modal?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/index/index?hash=b70e78f3f6180643e478f82053646e972f456b6d');
require('../../pages/cashout/cashout?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/center/center?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/sign/sign?hash=cffd211ba7e4c9afe8766a7cf94c7390e6353fbb');
require('../../pages/child/allTasks/allTasks?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/balance/balance?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/balanceDetail/balanceDetail?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/luckdraw/luckdraw?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/feedback/feedback?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/myFeedback/myFeedback?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/reply/reply?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/myCoin/myCoin?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/invitation/invitation?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/inviteRules/inviteRules?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/activityRules/activityRules?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/child/test/test?hash=c38b953af6bdab8fe399141b33dd1ad1ceb7ea7f');
require('../../pages/shengqian/shengqian?hash=0fef9b02a6f223a999d90af2cc5dc79eff879b09');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}