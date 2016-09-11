/**
 * CJmall PC 에서 이벤트프록시처리를 위한 이벤트명 리스트
 * - 이벤트명은 다른 이벤트명과 중복되지 않기 위해 'proxy'라는 접두어를 사용함.
 *
 * @module common/cjmall/util/p/eventProxyTypes
 * 
 * @see module:common/cjos/util/eventProxyManager
 */
module.exports = {
	/**
	 * 푸터의 렌더링이 완료되었을 때
	 * @event module:common/cjmall/util/p/eventProxyTypes.RENDERED_FOOTER
	 */
	RENDERED_FOOTER: 'proxy:renderedFooter'
};