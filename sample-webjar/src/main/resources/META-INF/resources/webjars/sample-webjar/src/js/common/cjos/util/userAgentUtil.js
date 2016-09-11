/**
 * 브라우저의 userAgent값을 참조하여 os, 앱정보등을 알아낼 수 있는 유틸
 *
 * @module common/cjos/util/userAgentUtil
 */

var ua = navigator.userAgent;
var uaLower = navigator.userAgent.toLowerCase ();

module.exports = {
	/**
	 * navigator.userAgent 값
	 * 
	 * @returns {String}
	 */
	getUA: function () {
	    return ua;
	},

	/**
	 * os정보
	 * 
	 * @returns {String}
	 */
	getOs: function () {
		var osName = '';
		if (this.getIsCjmallApp ()) {
			osName = uaLower.match (/os\=(\w+)/) [1];
		} else {
			if (uaLower.indexOf ('android') > -1) {
				osName = 'android';
			} else if (uaLower.indexOf ('iphone') > -1 || uaLower.indexOf ('ipad') > -1 || uaLower.indexOf ('ipod') > -1) {
				osName = 'ios';
			}
		}
		return osName;
	},
	
	/**
	 * 앱이름
	 * 
	 * @returns {String}
	 */
	getAppName: function () {
		if (uaLower.indexOf ('oshopping') > -1) {
			return 'OSHOPPING';
		} else if (uaLower.indexOf ('naver') > -1) {
			return 'NAVER';
		} else {
			return '';
		}
	},
	
	/**
	 * 앱인지 여부
	 * 
	 * @returns {Boolean}
	 */
	getIsApp: function () {
		var os = this.getOs ();
		var isApp = false;
		
		if (os === 'iOS') {
			if (uaLower.indexOf ('safari') === -1) {
				isApp = true;
			}
		} else if (os === 'Android') {
			if (uaLower.indexOf ('inapp') !== -1 || uaLower.replace ('applewebkit', '').indexOf ('app') !== -1) {
				isApp = true;
			}
		}
		if (uaLower.indexOf ('oshopping') > -1) {
			isApp = true;
		}
		return isApp;
	},
	//OSHOPPING(os=ios;osVersion=8.3;deviceMode=iPhone5,2;serviceName=cjmall;serviceVersion=5.1.6;)
	
	/**
	 * CJmall 앰인지 여부
	 * 
	 * @returns {Boolean}
	 */
	getIsCjmallApp: function () {
		var isCjmallApp = false;
		if (uaLower.indexOf ('oshopping') > -1) {
			isCjmallApp = true;
		}
		return isCjmallApp;
	},
	
	/**
	 * 오클락앱인지 여부
	 * 
	 * @returns {Boolean}
	 */
	getIsOclockApp: function () {
		var isOclockApp = false;
		if (uaLower.indexOf ('oclock') > -1) {
			isOclockApp = true;
		}
		return isOclockApp;
	},
	
	/**
	 * CJmall 앱버전
	 * 
	 * @returns {String}
	 */
	getCjmallAppVer: function () {
		var version = '0';
		if (this.getIsCjmallApp ()) {
			version = uaLower.match (/serviceversion\=([\d\.]+)/) [1];
		}
		return version;
	},
	
	/**
	 * Internet Explorer 버전
	 * 
	 * @returns {Number}
	 */
	getIeVer: function () {
		var rv = -1;
		var re  = new RegExp ('MSIE ([0-9]{1,}[\.0-9]{0,})');
		
		if (re.exec (ua) !== null) {
			rv = parseFloat (RegExp.$1);
		}
		return rv;
	},
	
	/**
	 * 안드로이드 버전
	 * 
	 * @returns {*}
	 */
	getAndroidVer: function () {
		var os = this.getOs ();
		if (os === 'android' ) {
			var match = uaLower.match (/android\s([0-9\.]*)/);
			return (match) ? parseInt (match [1]) : false;
		} else {
			return false;
		}
	},
	
	/**
	 * ios 버전
	 * 
	 * @returns {String}
	 */
	getIosVer: function () {
		var matchResult = uaLower.match (/(iphone )?os ([\d|_]+)/);
		var version = '';
		if (matchResult !== null && typeof matchResult [2] !== 'undefined') {
			version = String (matchResult [2]).split ('_').join ('.');
		}
		return version;
	}
};