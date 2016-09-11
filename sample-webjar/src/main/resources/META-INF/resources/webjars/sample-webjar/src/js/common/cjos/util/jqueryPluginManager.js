/**
 * 브라우저의 jquery플러그인 등록
 *
 * @module common/cjos/util/jqueryPluginManager
 */

module.exports = {
	/**
	 * jQuery플러그인으로 등록
	 * 
	 * @param {String} name 플러그인 이름
	 * @param {Function} factory 플러그인 생성자
	 */
	setPlugin: function (name, factory) {
		var fn = $.fn [ name ];
		if ( fn ) {
			return fn;
		} else {
			$.fn [ name ] = factory;
		}
	},

	/**
	 * jQuery플러그인에서 해지
	 * 
	 * @param {String} name 플러그인 이름
	 */	
	resetPlugin: function (name) {
		delete $.fn [name];
	}
};