import request from '../../http.js';
const { requestSubscribeMessage } = requirePlugin('subscribeMsg');

Component({
  mixins: [],
  data: {
    topListS:{
      qp:[]
    },
    bottomLists:[],//基础任务数据
    ymrwList:[],//云马
     ptrwwcShow:true,
    templateId1:'',
    dh0:true,
     dh1:true,
      dh2:true,
    name:my.Init.name,
    time:my.Init.time
  },
  props: {
    type:Number,
     onHidetest: (info)=>{
       console.log('info',info)
     },
  },
  onInit(){
    console.log('onInit',this.props.type)
     this.GetUserModel();
    if(this.props.type){
      this.setData({
        type:this.props.type
      })
    }
    var verShow= my.getStorageSync({ key: 'verShow' }).data
    if(verShow){
         this.setData({
            verShow:true
          })
    }
   if(this.props.type==5){
      this.centerList()
        return;
    }
   this.GetYunMa(); 
   this.GetTaskList()
   if(this.props.type==4){
     this.hbjhList()
   }
  },
  didMount() {},
  didUpdate() {
    console.log('didUpdate')
  },
  didUnmount() {},
  deriveDataFromProps(nextProps){
    console.log('nextProps')
  },

  methods:{
  jump_Mycoin(){
        my.navigateTo({
          url:'/pages/child/exchange/exchange'
        })
  }, 
  onRenderSuccess_rwwc(e){
     console.log('任务完成阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            rw_alBanShow:true
          })
    }else{
       this.setData({
            rw_alBanShow:false
          })
    }
  },
  onRenderSuccess_tswc(e){
     console.log('特殊任务完成阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            tsrw_alBanShow:true
          })
    }else{
       this.setData({
            tsrw_alBanShow:false
          })
    }
  },
  onRenderSuccess_rwdh(e){
    console.log('普通任务点击灯火',e)
     if(e.detail.height>0){
          this.setData({
            rwdhShow:true
          })
    }
  },

     onRenderSuccess_ptrwwc(e){
          console.log('onRenderSuccess_ptrwwc',e)
          if(e.detail.height>0){
                this.setData({
                  ptrwwcShowLj:true,
                  ptrwwcShow:true
                })
          }else{
            this.setData({
                 ptrwwcShowLj:true,
                  ptrwwcShow:false
                })
          }
      },
      onRenderSuccess0(e){
    console.log('第一个回调',e)
    if(e.detail.height>0){
          this.setData({
            dh0:true
          })
    }else{
       this.setData({
            dh0:false
          })
    }
  },
  onRenderSuccess1(e){
    console.log('第2个回调',e)
    if(e.detail.height>0){
          this.setData({
            dh1:true
          })
    }else{
       this.setData({
            dh1:false
          })
    }
  },
  onRenderSuccess2(e){
    console.log('第3个回调',e)
    if(e.detail.height>0){
          this.setData({
            dh2:true
          })
    }else{
       this.setData({
            dh2:false
          })
    }
  },
     //获取用户信息
        GetUserModel(){
            request('/api/v2/User/GetUserDetail/GetUserModel','GET', {issum:1
            // 传参参数名：参数值,如果没有，就不需要传
            }).then(res => {
              console.log('成功回调',res)
              this.setData({
                userInfo:res.data
              })
              my.Init.userInfo=res.data
            })
        },
      //云码数据获取
      GetYunMa(){
        request('/api/v5/Activity/GetYMTaskList','GET',{TaskArea:'rw&'}
                  ).then(result=>{
                    if(result.success){
                      console.log('子组件获取云马列表',result)
                      var topListS=this.data.topListS;
                        var nowList=result.data;
                        console.log('789',topListS.qp)
                        var qp=this.data.topListS.qp;
                      
                        for(var i=0;i<nowList.length;i++){
                              nowList[i].YMJsonString=JSON.parse(nowList[i].YMJsonString)
                              qp.unshift(nowList[i]);
                          }
                          topListS.qp=qp;
                      if(result.data.length > 0){
                        this.setData({
                            ymrwList:nowList,
                            topListS:topListS
                          })
                      }
                    }
                  })
          //普通任务完成后第一次显示特殊广告
            request('/api/v5/Activity/GetHBJHList','GET',{TaskArea:'ptrwwchalggtc'},
                  ).then(res=>{
                    if(res.success){
                      var nowList=res.data
                      for(var i=0;i<nowList.ym.length;i++){
                              nowList.ym[i].YMJsonString=JSON.parse(nowList.ym[i].YMJsonString)
                          }
                          for(var j=0;j<nowList.list.length;j++){
                              nowList.list[j].IsDone=false
                          }
                      this.setData({
                        rwTs:nowList
                      })
                      my.Init.rwTs=nowList
                      my.setStorageSync({
                        key:'rwTs',
                        data:nowList
                      })
                    }
                  })
                    //点击普通显示的灯火广告
            request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'ptrwalggtc'},
                  ).then(res=>{
                    if(res.success){
                      this.setData({
                        rwdh:res.data.ts
                      })
                      my.setStorageSync({
                        key:'rwdh',
                        data:res.data.ts
                      })
                    }
                  })     
      },
    //获取任务列表数据
      GetTaskList(){
           //任务区（云码气泡区进行合并）
            request('/api/v5/Activity/GetTaskList','GET',{}
                ).then(res=>{
                  if(res.success){
                    var data=res.data;
                      console.log('子组件气泡区列表',res)
                       for(var i=0;i<data.dh.length;i++){
                                data.dh[i].IsDone=true
                           }
                        if(this.data.ymrwList.length>0){
                            var ymrwList=this.data.ymrwList
                            for(var i=0;i<ymrwList.length;i++){
                                      data.qp.unshift(ymrwList[i]);
                            }
                            this.setData({
                              topListS:data
                            })
                        }else{
                            this.setData({
                              topListS:data
                            })
                        }
                      }
                })     
          request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'rw&',page:1,size:this.data.type==2?30:10}
                ).then(res=>{
                  console.log('子组件任务列表',res)
                  if(res.success){
                      this.setData({
                        bottomLists:res.data
                      })
                       my.uma.trackEvent('quqiandao_01',{'show':1})
                  }
                })
           if(this.data.type<2){
                      //灯火广告提示框
                request('/api/v5/Activity/GetTaskList','GET',{TaskArea:this.data.type==0?'syaligg':'qdymtsgg'},
                ).then(syaligg=>{
                  if(syaligg.success){
                    this.setData({
                      syalggList:syaligg.data.ts
                    })
                  }
                })
                //特殊广告（浏览几秒获得奖励）
                request('/api/v5/Activity/GetTaskList','GET',{TaskArea:this.data.type==0?'tsrwgg':'qdymtstc'},
                ).then(tsrwgg=>{
                  if(tsrwgg.success){
                    this.setData({
                      tsrwggList:tsrwgg.data.ts
                    })
                  }
                })
           }     
        //阿里广告提示框
         request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'aligg&'},
              ).then(aligg=>{
                if(aligg.success){
                  this.setData({
                    aliggList:aligg.data.ts
                  })
                  my.setStorageSync({
                    key:'aliggList',
                    data:aligg.data.ts
                  })
                }
              })
         
      },
    ////红包集合页的三条灯火/任务数据 
    hbjhList(){
        request('/api/v5/Activity/GetHBJHList','GET',{TaskArea:'hbjhy&'},
      ).then(res=>{
        if(res.success){
          console.log('子组件获取红包集合页数据',res)
          var nowList=res.data
            for(var i=0;i<nowList.ym.length;i++){
                  nowList.ym[i].YMJsonString=JSON.parse(nowList.ym[i].YMJsonString)
              }
          this.setData({
            rwTs2:nowList
          })
        }
      })        
          
    },
    //个人中心灯火
     centerList(){
       request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'wdymtsgg'},
				).then(syaligg=>{
					if(syaligg.success){
             this.setData({
               syalggList:syaligg.data.ts
             })
					}
        })
         request('/api/v5/Activity/GetTaskList','GET',{TaskArea:'wdymtsgg'},
				).then(tsrwgg=>{
					if(tsrwgg.success){
            this.setData({
               tsrwggList:tsrwgg.data.ts
             })
					}
        })
    },
    childMethod(){
        console.log("调用到了子组件的办法")
    },
    lifeClose(){
      this.props.onHidetest({'close':0});
    },
         //任务跳转页面
			tabNav(e){
        let JumpType=e.currentTarget.dataset.JumpType;
        let item=e.currentTarget.dataset.item;
        var that=this;
        if(item.IsAliAdvert==1&&this.data.alBanShow&&this.data.rwdh.length>0){
          this.setData({
           ['rwdh[0].Id']:item.Id,
           modalname:'rwdh'
          })
          return;
        }
        if(item.IsDone==false){
          this.setData({
            Id:item.Id
          })
          my.Init.Id=item.Id;
          console.log('my.Init.Id',my.Init.Id)
          my.Init.BrowseTime=item.BrowseTime
        }
				if(JumpType==1){
          if(item.IsDone==false){
              this.setData({
                          modalname:'life',
                          lifeImg:item.Img,
                          lifeTittle:item.Title,
                          lifeSutittle:item.Subtitle,
                          sceneId:item.Component
                    }) 
               my.uma.trackEvent('quqiandao_01',{'click':1})
          }
          this.setData({
            Id:item.Id
          })
					console.log('关注生活号')
					return;
        }
				if(JumpType==2){
              console.log('收藏小程序')
              my.setStorageSync({
                          key: 'Id',
                          data: item.Id
                });
                if(item.IsDone==false){
                  this.setData({
                      BrowseTime:item.BrowseTime,
                      Id:item.Id
                  })
                  that.watchTaobo();
                  my.uma.trackEvent('quqiandao_01',{'click':1})
              }
              my.navigateToMiniProgram({
                appId:item.APPID,
                path:item.AliAdvertisingLink,
                success:(res)=> {
                }
              })
					return;
        }
				if(JumpType==3){
          console.log('跳转小程序评价')
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('quqiandao_01',{'click':1})
					}
					my.navigateToMiniProgram({
						appId:item.APPID,
						path:item.AliAdvertisingLink,
						success:(res)=> {
							// that.watchTaobo()
						}
					})
					return;
				}
				if(JumpType==4){
					console.log('跳转直播间')
					 if(item.IsDone==false){
            this.setData({
                rwName:'taobao',
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('quqiandao_01',{'click':1})
          }
          // 	my.ap.navigateToAlipayPage({
					// 	path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttps://sptest.litchon.com/taobao.html?id='+item.Id,
					// 	success:(res) => {
							
					//     },
					//     fail:(error) => {
					                
					//     }
					// })
					my.ap.navigateToAlipayPage({
						path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttps://api.shupaiyun.com/jumptb1.html?id='+item.Id,
						success:(res) => {
							
					    },
					    fail:(error) => {
					                
					    }
					})
					
					return;
				}
				if(JumpType==5||JumpType==6||JumpType==14){
          //生活号文章-h5
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('quqiandao_01',{'click':1})
					}
					my.ap.navigateToAlipayPage({
						path:item.AliAdvertisingLink,
						success:(res) => {
					      
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					return;
				}
			
        if(JumpType==7){
          console.log('添加桌面');
           my.setStorageSync({
                          key: 'zid',
                          data: item.Id
                });
          this.setData({
            RewardAmount:item.RewardAmount,
            modalname:'zhuomian'
          })
           my.uma.trackEvent('quqiandao_01',{'click':1})
           return;
				}
				if(JumpType==8){
					my.navigateTo({
						url:'../child/sign/sign'
					})
					return;
				}
				if(JumpType==9){
					console.log('跳转金币明细')
					my.navigateTo({
						url:'../child/balanceDetail/balanceDetail'
					})
					return;
				}
				if(JumpType==10){
					console.log('跳转邀请好友')
					// my.navigateTo({
					// 	url:'../invation/invation'
					// })
					my.navigateTo({
						url:'../child/invitation/invitation?taskid='+item.Id
					})
					return;
        }
        if(JumpType==11){
          console.log('跳转其他小程序');
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('quqiandao_01',{'click':1})
					}
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink+'?BrowseTime='+item.BrowseTime,
                  extraData:{
                    appId:"2021002151689730",
                    appName:'开心赚点'
                  },
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
             });
					return;
        }
        if(JumpType==12){
            console.log('跳转内敛');
             if(item.IsDone==false){
               that.watchTaobo();
               }
            if(item.AliAdvertisingLink){
                my.navigateTo({
                  url:item.AliAdvertisingLink+'?BrowseTime='+item.BrowseTime
                })
            }else{
              my.alert({
                content:'参数有误,请联系管理人员'
              })
            }
            return;
        }
        if(JumpType==13){
            console.log('云码入会',item.YMJsonString.TaskType);
             const ym=item.YMJsonString;
            if(item.IsDone==false){
               this.setData({
              Id:item.Id,
              taskid:item.YMJsonString.TaskId
            })
            my.setStorageSync({
              key: 'taskid',
              data:item.YMJsonString.TaskId//云码id
            })
             my.setStorageSync({
              key: 'id',//列表id
              data:item.Id
            })
            }
             const taskType = item.YMJsonString.TaskType;  
            const alipayOpenId = this.data.userInfo.AliAppletOpenId;  
            const taskId = item.YMJsonString.TaskId;   
            const channel ='QD-XMSP-229715';  // 测试时为test , 生产时候为 channelId(向产品索取)  
            var link ='https://d.alipay.com/?scheme=' + encodeURIComponent('alipays://platformapi/startApp?appId=2021002151689730&page=pages%2Findex%2Findex%3Fyunmaid%3D'+taskId);  // 任务完成后续跳转, 浏览商品没有  
            //link = "https%3A%2F%2Fd.alipay.com%2F%3Fscheme%3Dalipays%3A%2F%2Fplatformapi%2FstartApp%3FappId%3D2021002151689730%26page%3Dpages%2Findex%2Findex%3Fyunmaid%3D123";
            link =encodeURIComponent('alipays://platformapi/startApp?appId=2021002151689730&page=pages%2findex%2findex%3fyunmaid%3d123');  // 任务完成后续跳转, 浏览商品没有  
            const userId = '12345677';  
            const userNick= '123XXX';
            const content= item.YMJsonString.Content;
            const appId = '2021002151689730'  // 小程序ID  
            const pages = `page/index/index?extra=${encodeURIComponent(JSON.stringify({a:1,b:'你好'}))}` // 小程序中需要跳转页面  extra中存放额外参数  
            const appUrl = `alipays://platformapi/startapp?${encodeURIComponent(`appId=${appId}&page=${encodeURIComponent(pages)}`)}`   
            const url = `${content}&taskType=${taskType}&alipayOpenId=${alipayOpenId}&taskId=${taskId}&channel=${channel}&link=${encodeURIComponent(link)}`;
           console.log('url',url)
       // return;
        my.ap.navigateToAlipayPage({
					 path:encodeURIComponent(`https://render.alipay.com/p/h5/cloudcode-fe/redirect.html?target=${encodeURIComponent(url)}`),
						success:(res) => {
					     
					    },
					    fail:(error) => {
					        my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
          })
        }
        if(JumpType==15){
          console.log('添加支付宝首页');
           my.setStorageSync({
                          key: 'sid',
                          data: item.Id
                });
          this.setData({
            RewardAmount:item.RewardAmount,
            modalname:'zfbsy'
          })
           my.uma.trackEvent('quqiandao_01',{'click':1})
           return;
        }
        if(JumpType==16){
            this.setData({
              Id:item.Id,
              templateId1:item.APPID
            })
            this.onTapBtn_rw()
             my.uma.trackEvent('quqiandao_01',{'click':1});return
        }
        if(JumpType==17){
            my.Init.fid=item.Id;
             my.uma.trackEvent('quqiandao_01',{'click':1});return
        }
        if (JumpType==18) {
              console.log(item,'跳转内链');
                      my.setStorageSync({
                        key: 'nltime',
                        data: item.BrowseTime //云码id
              }) 
              // if(my.getStorageSync({key: 'djstime'}).data){
              // item.BrowseTime=item.BrowseTime-my.getStorageSync({key: 'djstime'}).data
              // } 
              if (item.IsDone == false) {
                      this.setData({
                        BrowseTime: item.BrowseTime,
                        Id: item.Id
              }) 
              that.watchTaobo();
              }
                    if (item.AliAdvertisingLink) {
                      my.navigateTo({
                        url:item.AliAdvertisingLink+'?id='+item.Id+'&jl='+item.RewardAmount
                      })
                    } else {
                      my.alert({
                        content: '参数有误,请联系管理人员'
                      })
                    }
                    return;
          }
      },
      watchTaobo(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
             console.log("当前时间戳为：" + timestamp); 
             this.setData({
                  time:timestamp
             })
             my.Init.time=timestamp
      },
      AddReward_all(id){
          var that=this;
          request('/api/v5/Activity/AddReward','POST',{ taskId:id,Mark:my.getStorageSync({ key: 'Mark' }).data,UserId:my.getStorageSync({ key: 'UserId' }).data}).then(res=>{
            if(res.success){
              my.Init.Id='';
               my.Init.fid='';
              my.Init.time='';
                console.log('增加金币成功')
                 my.removeStorageSync({
                    key: 'id',
                  });
                  my.removeStorageSync({
                    key: 'taskid',
                  });
                 my.removeStorageSync({
                  key: 'zid',
                });
                my.removeStorageSync({
                key: 'zhuomianShow',
              });
               my.removeStorageSync({
                  key: 'sid',
                });
                my.removeStorageSync({
                key: 'zfbsy',
              });
              
                if(res.data.usercount==0){
                    this.setData({
                       rwName:'',
                    modalname:'rwts',
                    time:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:false
                    })
                }else{
                    this.setData({
                    rwName:'',
                    modalname:'',
                    time:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:true
                })
                }
                my.uma.trackEvent('quqiandao_01',{'success':1});
                        //全部任务页任务完成后手动修改
                              var list=this.data.bottomLists;
                              if(list.length<11){
                                  this.GetTaskList();
                                  return;
                              }
                              for(var i=0;i<list.length;i++){
                                    if(list[i].Id==this.data.Id){
                                        var sid=i;
                                         let newlist=list[i];
                                         newlist.IsDone=true;
                                         list.splice(i,1)
                                         if(!my.Init.isLoad){
                                            my.Init.isLoad=true;
                                            list.push(newlist)
                                         }
                                        // var lists='bottomLists['+sid+'].IsDone'
                                        this.setData({
                                         bottomLists:list
                                        })
                                         console.log('sid',list);
                                        return
                                    }
                              }
                             console.log('list2',list) 
                          
                  // setTimeout(()=>{
                  //         // that.GetTaskList();
                         
                  // },1000)
                  //  setTimeout(()=>{
                  //               list.splice(sid,1)
                  //               console.log('list',list)
                  //               this.setData({
                  //                 bottomLists:list
                  //               })
                  //             },1500)
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
        
      },
            //默认增加金币/集分宝接口
			 AddReward(id){
         var that=this;
          request('/api/v5/Activity/AddReward','POST',{ taskId:id,Mark:my.getStorageSync({ key: 'Mark' }).data,UserId:my.getStorageSync({ key: 'UserId' }).data}).then(res=>{
            if(res.success){
              my.Init.Id='';
               my.Init.fid='';
              my.Init.time='';
                console.log('增加金币成功')
                 my.removeStorageSync({
                    key: 'id',
                  });
                  my.removeStorageSync({
                    key: 'taskid',
                  });
                 my.removeStorageSync({
                  key: 'zid',
                });
                my.removeStorageSync({
                key: 'zhuomianShow',
              });
               my.removeStorageSync({
                  key: 'sid',
                });
                my.removeStorageSync({
                key: 'zfbsy',
              });
              
                if(res.data.usercount==0){
                    this.setData({
                       rwName:'',
                    modalname:'rwts',
                    time:'',
                    Id:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:false
                    })
                }else{
                    this.setData({
                    rwName:'',
                    modalname:'',
                    time:'',
                    Id:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:true
                })
                }
              
              
                my.uma.trackEvent('quqiandao_01',{'success':1});
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
           setTimeout(()=>{
                  that.GetTaskList();
                  if(this.data.type==4){
                      this.hbjhList()
                  }
          },1000)
      },
        	// 任务订阅授权
				  onTapBtn_rw(e) {
					  var that=this;
					  console.log('e',this.data.templateId1)
				    // 模板id列表
				    const templateList = [];
				    this.data.templateId1 && templateList.push(this.data.templateId1);
				    this.data.templateId2 && templateList.push(this.data.templateId2);
				    this.data.templateId3 && templateList.push(this.data.templateId3);
				    if (templateList.length === 0) {
				      my.showToast({
				        type: 'fail',
				        content: '请填写模板id',
				        duration: 3000,
				      });
				      return;
				    }
				
				    // 调用方法，唤起订阅组件
				    requestSubscribeMessage({
				      // 模板id列表，最多3个
				      entityIds: templateList,
				      // 接收结果的回调方法
				      callback(res) {
				        console.log('订阅回调', res);
				        if (res.success){
				          const successIds = templateList
				            .filter(i => res[i.entityId] === 'accept')
				            .map(i => i.entityId);
						
								that.sendMes()
						
				          // 订阅成功
				          // my.call('toast', {
				          //   content: `模板${successIds.join(',')}订阅成功`,
				          //   type: 'success',
				          // });
				        } else {
				          switch (res.errorCode) {
				            case 11: {
				              my.call('toast', {
				                content: '用户未订阅关闭弹窗',
				              });
				              break;
				            }
				            default: {
				              my.call('toast', {
				                content: `ErrorCode: ${res.errorCode}, ErrorMsg: ${res.errorMessage}`,
				              });
				              break;
				            }
				          }
				        }
				      },
				    });
      },
       sendMes(){
				request('/api/v2/Push/Push','GET',{templateId:this.data.templateId1}).then(res=>{
          console.log(res)
          if(res.success){
            this.AddReward(my.Init.Id)
          }
				})
      },
      closeModal(){
        this.setData({
          modalname:'',
          modalShow:false
        })
      },
      //时间未达标浏览弹窗
      msg(){
        console.log('子组件时间未达标浏览弹窗')
        my.Init.Id='';
        my.Init.fid='';
        my.Init.time='';
        if(this.data.rwName=='taobao'){
            this.setData({
              modalname:'taobao',
            });return
          }
					my.alert({
						content:'访问'+this.data.BrowseTime+'秒以上才能领取奖励哦'
          })
      },
       onRenderSuccess(e){
          console.log('首页阿里图片banner广告加载成功',e)
          if(e.detail.height>0){
                this.setData({
                  alBanShow:true
                })
                my.setStorageSync({
                  key:'alBanShow',
                  data:true
                })
          }
        },
        jump_allTasks(){
          my.navigateTo({
            url:'/pages/child/allTasks/allTasks'
          })
      },
      //点击灯火广告（有显示提示框表示可以做任务）
			jump_banner(e){
        console.log('e',e);
        let num=e.currentTarget.dataset.num;
         let modalInfo=e.currentTarget.dataset.modalInfo;
          let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo)
				if(modalInfo==false){
          this.watchTaobo()
          console.log('有收益');
          this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
          })
          my.Init.Id=item.Id;
          my.Init.BrowseTime=item.BrowseTime;
					
				}
      },
       watchTaobo3(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;
            this.setData({
                timets:timestamp,
            })
            my.Init.timets=timestamp;
				    console.log("当前时间戳为：" + timestamp); 
				    
      },
      //全部任务页分页加载数据
      allTaskList(list){
        console.log('子组件获取全部任务页下一页数据')
        let bottomLists=this.data.bottomLists.concat(list);
        this.setData({
          bottomLists:bottomLists
        })
      },
       test(){
        let list=this.data.bottomLists;
        console.log('list',list)
        var that=this;
        var a=0;
        setInterval(()=>{
           console.log(a++)
            console.log('789')
            that.addtest(list[a].Id)
        },20000)
      },
      addtest(id){
        request('/api/v5/Activity/AddReward','POST',{ taskId:id,Mark:my.getStorageSync({ key: 'Mark' }).data,UserId:my.getStorageSync({ key: 'UserId' }).data}).then(res=>{
            if(res.success){

                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
      }
     
  },
 
});
