var pako = require('./pako.min.js');
 const polyfill = require('./base64.js')
const {atob, btoa} = polyfill;
function unzip(key){
            // 将二进制字符串转换为字符数组
    var charData = key.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    // 将数字数组转换成字节数组
    var binData = new Uint8Array(charData);
    // 解压
    var data = pako.inflate(binData);
    // key = String.fromCharCode.apply(null, new Uint16Array(data));
    var res = '';
    var chunk = 16 * 1024;
    var i;
    for (i = 0; i < data.length / chunk; i++) {
        res += String.fromCharCode.apply(null, data.slice(i * chunk, (i + 1) * chunk));
    }
    res += String.fromCharCode.apply(null, data.slice(i * chunk));
    // 将GunZip ByTAREAR转换回ASCII字符串
    return decodeURIComponent(escape(res));
}
const baseUrl = 'https://api.shupaiyun.com';
// const baseUrl = 'http://192.168.0.142:688';
//  const baseUrl = 'https://sptest.litchon.com';
const request = (url = '', type = '', date = {}, header = {
}) => {
    return new Promise((resolve, reject) => {

      // if(url.indexOf("/Activity/GetTaskList") > 0) {
      //   date.isGZip = 1;
      // }
      // if(url.indexOf("/Activity/GetYMTaskList") > 0) {
      //   date.isGZip = 1;
      // }
      //  if(url.indexOf("/Activity/GetLotteryManagementList/GetLotteryManagementList") > 0) {
      //   date.isGZip = 1;
      // }

        my.request({
            method: type,
            url: baseUrl + url,
            data: date,
            headers: {'content-type': 'application/json','Authorization': "Bearer "+ my.getStorageSync({ key: 'token' }).data || '' },
            dataType:  'json', 
            success:function(res){
              my.hideLoading();

              if(res.data.isGZip) {
                res.data.data = JSON.parse(unzip(atob(res.data.data)));
               
              }

              resolve(res.data)
            }        
        })
    });
}
export default request