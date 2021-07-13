var plugin = requirePlugin("myPlugin");
Page({
  data: {
     resourceId: "AD_20210514000000100664",
  },
  onLoad() {},
   onReachBottom() {
          if(plugin && plugin.loadMore) {
          plugin.loadMore();
        }
    },
});
