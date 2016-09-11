/**
 * PC/모바일에서 사용하는 공통유틸함수 모음
 *
 * @module common/cjos/util/commonUtil
 */

module.exports = {
	/**
	 * 싱글톤패턴으로 인스턴스를 생성할 수 있게 파라미터의 생성자함수를 랩핑하여 리턴함
	 *
	 * @param {Function} constructor 클래스(생성자함수)
	 * @param {Boolean} isMultipleArgs 생성매개변수가 2개이상인지 여부 (주의) - Backbone.View는 2개이상의 매개변수가 지정될시 특정단말기에서 제대로 작동되지 않는다.
	 * @returns {Function} new 지시나, .getInstance 메서드를 써도 항상 동일한 인스턴스 반환하는 생성자
	 */
	getSingleton: function (constructor, isMultipleArgs) {
		var Singleton = function () {
			return Singleton.getInstance.apply (this, arguments);
		};
		Singleton.__instance__ = null;
		Singleton.getInstance = function () {
			if (!Singleton.__instance__) {
				var factory = (isMultipleArgs) ? Function.prototype.bind.apply (constructor, [null].concat (_.toArray (arguments))) :
												 _.bind (constructor, null, arguments [ 0 ]);
				Singleton.__instance__ = new factory ();
			}
			return Singleton.__instance__;
		};
		Singleton.hasInstance = function () {
			return (Singleton.__instance__ !== null);
		};
		return Singleton;
	}
};