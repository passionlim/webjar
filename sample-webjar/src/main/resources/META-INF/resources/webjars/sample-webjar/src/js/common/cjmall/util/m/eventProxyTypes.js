/**
 * CJmall 모바일에서 이벤트프록시처리를 위한 이벤트명 리스트
 * - 이벤트명은 다른 이벤트명과 중복되지 않기 위해 'proxy'라는 접두어를 사용함.
 *
 * @module common/cjmall/util/m/eventProxyTypes
 * 
 * @see module:common/cjos/util/eventProxyManager
 */
module.exports = {
	/**
	 * 좌측 카테고리 열기버튼을 눌렀을때
	 * @event module:common/cjmall/util/m/eventProxyTypes.CLICK_CATEGORY
	 */
	CLICK_CATEGORY: 'proxy:clickCategory',
	
	/**
	 * 헤더의 높이가 변경되었을 때
	 * @event module:common/cjmall/util/m/eventProxyTypes.CHANGED_HEADER_HEIGHT
	 */
	CHANGED_HEADER_HEIGHT: 'proxy:changedHeaderHeight',
		
	// 메인 페이지에서 사용하는 이벤트그룹명 prefix -> MAIN__
	/** 
	 * 메인 딜 슬라이드 메뉴  고정(fixed)되어야 할 때
	 * @event module:common/cjmall/util/m/eventProxyTypes.MAIN__ADD_FIXED_TAB
	 */
	MAIN__ADD_FIXED_TAB: 'proxyDeal:addFixedTab',
	
	/**
	 * 메인 딜 슬라이드 메뉴  고정(fixed) 필요 없을 때
	 * @event module:common/cjmall/util/m/eventProxyTypes.MAIN__DEL_FIXED_TAB
	 */
	MAIN__DEL_FIXED_TAB: 'proxyDeal:removeFixedTab',
	
	/**
	 * 메인  tv쇼핑 배너리스트 append 완료시
	 * @event module:common/cjmall/util/m/eventProxyTypes.MAIN__COMPLETE_APPENDLISTS_TVBANNER
	 */
	MAIN__COMPLETE_APPENDLISTS_TVBANNER: 'proxyTVshop:completeAppendListBanners',
	
	/**
	 * 메인  tv쇼핑 배너리스트 append 실패시
	 * @event module:common/cjmall/util/m/eventProxyTypes.MAIN__FAIL_APPENDLISTS_TVBANNER
	 */
	MAIN__FAIL_APPENDLISTS_TVBANNER: 'proxyTVshop:failAppendListBanners',
};
