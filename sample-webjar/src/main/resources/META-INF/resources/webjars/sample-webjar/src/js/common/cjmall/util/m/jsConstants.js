/**
 * CJmall에서 사용되는 상수모음
 *
 * @module common/cjmall/util/m/jsConstants
 */

module.exports = {
	/**
	 * global 상수
	 */
	GLOBAL: {
		IS_LOGIN :(_.isUndefined(Cookies.get('M_CJ_LOGIN'))?false:('Y'=== (Cookies.get('M_CJ_LOGIN'))?true:false)),
		CERT_YN:(_.isUndefined(Cookies.get('M_CERT_YN'))?false:('1'=== (Cookies.get('M_CERT_YN'))?true:false)),
		CJMEMBERLOGIN:(_.isUndefined(Cookies.get('CJMEMBERLOGIN'))?false:('Y'=== (Cookies.get('CJMEMBERLOGIN'))?true:false)),
		M_AGE:(_.isUndefined(Cookies.get('M_AGE'))?0:(Cookies.get('M_AGE'))),
		// 로컬스토리지 지원여부
		SUPPORT_LOCAL_STORAGE: (function () {
			try {
				var hasLocalStorage = 'localStorage' in window && window ['localStorage'] !== null;
				if (hasLocalStorage) {
					localStorage.setItem ('__cjmall__support__storage__', 'testLocalStorage');
					return true;
				} else {
					return false;
				}
			} catch (e) {
				return false;
			}
		}) ()
	},
	
	/**
	 * 검색결과 정렬순서
	 */
	ORDERED: {
		RECOMMEND_DESC: 'RECOMMEND_DESC', // 추천순
		REGISTER_DATE_DESC: 'REGISTER_DATE_DESC', // 신상품 순
		BEST_SELLING_DESC: 'BEST_SELLING_DESC', // 인기상품 순
		REVIEW_COUNT_DESC: 'REVIEW_COUNT_DESC', // 상품평 순
		PRICE_ASC: 'PRICE_ASC', // 저가 순
		PRICE_DESC: 'PRICE_DESC', // 고가 순
	},
	
	/**
	 * URL 모음
	 */
	URL: {
		MAIN: '/m/page.jsp', // 메인
		CART: '', // 장바구니
		CATEGORY: '', // 카테고리
	},
	
	/**
	 * DOMAIN 모음
	 */
	DOMAIN: {
		FIRSTLOOK: 'http://mw.firstlook.co.kr', // 메인
		CJONMART: 'http://m.cjonmart.net', // 온마트
		BABYOSHOP: 'http://m.babyoshop.co.kr', // 베이비오샵
		OMART: 'http://m.omart.com', // 오마트
		OLIVEYOUNGSHOP: 'http://mw.oliveyoungshop.com', // 올리브영샵
		MINSU: 'http://minsu.cjmall.com', // 보험/금융
		GETITBEAUTY: 'http://m.getitbeautyshop.com' // 겟잇뷰티
	},
	
	/**
	 * IMG_URL 모음
	 */
	IMG_URL: {
		SEARCH: 'http://itemimage.cjmall.com/goods_images/', // 검색 이미
		MOCODE_SEARCH: 'http://image.cjmall.com/cjupload/banner/page/' // 검색 모코드 이미지
	},
	
	/**
	 * 쿠키 키값
	 */
	COOKIE_KEYS: {
		APP_BANNER_CLOSE_DATE: 'UI_App_Bn' // 홈에서 앱다운로드 배너창을 닫을 때 사용(현재날짜저장 -> 160613) 
	}
};

