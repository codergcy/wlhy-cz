import { http } from '@/common/service/service.js' 
import configService from '@/common/service/config.service.js';
const apiService = {
	 
	 /**
	  * 登录
	  */
	login(params) {
		return http.post('/sys/login',params)	
	},
	/**
	  * 手机号码登录
	  */
	phoneNoLogin(params) {
		return http.post('/sys/phoneLoginPC',params);
	},
	/**
	  * 第三方登录
	  */
	// thirdLogin(token, thirdType,tenantId) {
	// 	return http.get(`/sys/thirdLogin/getLoginUser/${token}/${thirdType}/${tenantId}`);
	// },
	/**
	  * 退出
	  */
	// logout(params) {
	// 	return http.post('/user/logout',params);
	// },
	/**
	 * 获取文件访问路径
	 * @param avatar
	 * @param subStr
	 * @returns {*}
	 */
	getFileAccessHttpUrl(avatar,subStr){
	    if(!subStr) subStr = 'http'
	    if(avatar && avatar.startsWith(subStr)){
	        return avatar;
	    }else{
	        return configService.staticDomainURL + "/" + avatar;
	    }
	}
};

export default apiService;
