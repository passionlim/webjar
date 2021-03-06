/**
 * 로그인정보 가져오기
 *
 * @module common/cjos/util/loginUserInfo
 * 
 * @requires module:common/cjos/util/jspVariables
 */
//import
var jspVariables = require ('common/cjos/util/jspVariables');

// loginUserInfo

var info = null;
var isInit = false;
var subcriberList = [];
var defaults = {
	isDone: false,
	isLogin: false,
	isEmployee: false,
	isBadCust: false,
	isSimple: false,
	memberId: '',
	simpleCustNo: '',
	certYn: false,
	age: 0
};

function init () {
	isInit = true;
	$.ajax ({
		url: jspVariables.get ('mobileSslUrl') + '/api/user/loginUserInfo.json',
		xhrFields: {
			withCredentials: true // https 호출시
		},
		success: function (data) {
			if (jsonValidate (data)) {
				var result = data.result;
				info = {
					isDone: true,
					isLogin: result.isLogin,
					isEmployee: result.isEmployee,
					isBadCust: result.isBadCust,
					isSimple: result.isSimple,
					memberId: result.memberId,
					simpleCustNo: result.simpleCustNo,
					certYn: result.certYn,
					age: (result.age) ? parseInt (result.age, 10) : 0
				};
			} else {
				info = defaults;
			}
			publish ();
		},
		fail: function () {
			info = defaults;
			publish ();
		}
	});
}

function jsonValidate (data) {
	if (!data || data.code === 0 || !data.result) {
		return false;
	}
	return true;
}

function publish () {
	for (var i = 0, len = subcriberList.length; i < len; i++) {
		var callback = subcriberList [i].callback;
		var context = subcriberList [i].context;
		
		if (context) {
			callback.apply (callback, [info]);
		} else {
			callback (info);
		}
	}
}

module.exports = {
	/**
	 * 로그인정보 가져오기
	 * 
	 * @param {Function} callback 로그인정보가져오기가 완료될 때 호출할 콜백함수
	 * @param {Object} context 콜백함수와 스코프를 연결할 컨텍스트
	 */
	get: function (callback, context) {
		if (info) {
			if (context) {
				callback.apply (context, [info]);
			} else {
				callback (info);
			}
			return;
		}
		
		if (!isInit) {
			init ();
		}
		
		subcriberList.push ({
			context: context,
			callback: callback
		});
	}
};