/**
 * 전역에서 사용할 수 있도록 전역변수 get/set 유틸
 *
 * @module common/cjos/util/globalVariables
 */
var variable = {},
	initVars = window.__cjos_globalVars__;

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
	set: set,
	
	/**
	 * 값 가져오기
	 * 
	 * @param {String} k 키
	 * @returns {*} 값
	 */	
	get : function (k) {
		return variable [k];
	},

	/**
	 * 키삭제
	 * 
	 * @param {String} k 키
	 */	
	remove: function (k) {
		delete variable [k];
	}
};
