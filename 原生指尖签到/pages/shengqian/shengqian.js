var plugin = requirePlugin("myPlugin");
Page({
  data: {
     resourceId: "AD_20210517000000100671",
  },
  onLoad() {},
   onReachBottom() {
          if(plugin && plugin.loadMore) {
          plugin.loadMore();
        }
    },
});
