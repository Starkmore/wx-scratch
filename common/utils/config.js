
/**
 * 小程序配置文件
 */

// let baseUrl = 'https://api.dgan.didoxy.com/';
let baseUrl = 'https://api1.dgan.didoxy.com/';


let p_v1='v1';
let p_v2='v2';

module.exports = {
    baseUrl,
    pageSize:10,
    header:{
        '1':{'Accept': 'application/vnd.lumen.'+p_v1+'+json'},
        '2':{'Accept': 'application/vnd.lumen.'+p_v2+'+json'},
    }
};