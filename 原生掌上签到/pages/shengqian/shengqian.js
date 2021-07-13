var plugin = requirePlugin("myPlugin");
Page({
  data: {
     resourceId: "AD_20210521000000100693",
  },
  onLoad() {},
   onReachBottom() {
          if(plugin && plugin.loadMore) {
          plugin.loadMore();
        }
    },
});
