/**
 * CJmall에서 사용되는 앱과 웹뷰사이의 interface
 *
 * @module common/cjmall/util/m/appInterfaceUtil
 * 
 * @requires module:common/cjos/util/userAgentUtil
 */
var userAgentUtil = require ('common/cjos/util/userAgentUtil');

var os = userAgentUtil.getOs ();
var isApp = userAgentUtil.getIsApp ();
var appName = userAgentUtil.getAppName ();
var isOShoppingApp = (isApp && appName === 'OSHOPPING') ? true : false;
var scheme = 'cjmallapp://cjosapi/';

// ios 메서드리스트
var iosMethods = {
	_execSchemeUrl: function (methodName, param) {
		var url = scheme + methodName;
		if (typeof param === 'string') {
			url += '?' + param;
		}
		location.href = url;
	},
	
	back: function () {
		this._execSchemeUrl ('back');
	}
};

module.exports = {
	/**
	 * 웹뷰에서 앱메서드 호출
	 *
	 * @param {String} methodName 메서드 이
	 * @returns {Array} 매개변수
	 */	
	sendMessage: function (methodName, argsArr) {
		if (isOShoppingApp) {
			if (os === 'ios') {
				methods [methodName].apply (this, argsArr);
			} else {
				window.cjosapi [methodName].apply (this, argsArr);
			}
		} else {
			// console.log ('오쇼핑 앱이 아님');
		}
	}
};

