/**
 * 서버에서 전달된 parameter를 get/set 하는 모듈 (명시적으로 사용하기 위함)
 * 
 * @module common/cjos/util/jspVariables
 */
var variable = {},
	initVars = window.__cjos_jspVars__;

if (_.isObject (initVars)) {
	set (initVars);
}

function set (k, v) {
	if (arguments.length > 1) {
		variable [k] = v;
	} else {
		for (var key in k) {
			variable [key] = k [key];
		}
	}
}

module.exports = {
	/**
	 * 값설정
	 * 
	 * @param {String} k 키
	 * @param {*} v 값
	 */
	set : set,
	
	/**
	 * 값 가져오기
	 * 
	 * @param {String} k 키
	 * @returns {*} 값
	 */		
	get : function (k) {
		return variable [k];
	}
};