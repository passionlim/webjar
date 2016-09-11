/**
 * 이벤트프록시처리모듈
 *  - 모듈간 커스텀이벤트를 발생시키고 듣기 위해 중간에 프록시 형태로 이벤트를 중계해줌
 *  - 임의의 jquery dom 객체를 사용함
 *  - 이벤트명은 각 사이트의 eventProxyTypes에 정의된 상수타입만 사용하도록 함
 *
 * @module common/cjos/util/eventProxyManager
 */

var root = $ ('<div></div>');

module.exports = {
	/**
	 * 이벤트등록
	 *
	 * @param {String} type 이벤트명
	 * @param {Function} fn 콜백
	 */
	listen: function (type, fn) {
		root.on (type, fn);
	},
	
	/**
	 * 이벤트해지
	 * 
	 * @param {String} type 이벤트명
	 * @param {Function} fn 콜백
	 */
	stopListening: function (type, fn) {
		root.off (type, fn);
	},
	
	/**
	 * 이벤트 트리거
	 *
	 * @param {String} type 이벤트명
	 * @param {*} exParams 추가로 전달할 옵셔널 값
	 */
	trigger: function (type, exParams) {
		root.trigger (type, exParams);
	}
};

