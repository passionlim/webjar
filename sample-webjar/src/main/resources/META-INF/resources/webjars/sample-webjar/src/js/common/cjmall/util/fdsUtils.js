/**
 * fds로그를 남기기 위한 유틸리티
 * 
 * @module common/cjmall/util/fdsUtils
 * 
 * @requires module:common/cjos/util/jspVariables
 */
// import
var jspVariables  = require ('common/cjos/util/jspVariables');

// fdsUtils

function fdsInit(){
	var currUrl = document.location.href;
	var platform = 'web';
	var cookieDomain = '.cjmall.com';
	var fdsCookie = '';
	var memberId = jspVariables.get ('memberId');
	
	if (Cookies.get('U_COOKIE') !== null) {
		fdsCookie = Cookies.get('U_COOKIE');
	}
	if (currUrl.indexOf('cjmall.com/m/') > -1) {
		platform = 'mob';
	}
	eyelight ('setUserId', memberId);
	eyelight ('setPlatform', platform);
	eyelight ('setCookieDomain', cookieDomain);
	eyelight ('setFdsCookie', fdsCookie);
}

module.exports = {
	describe: 'Fds Logging Utils',
	isSelfPageView: false,
	data: undefined,
	fdsInit: fdsInit,
	fnPageView: {
		describe: 'Fds PageView Function',
		run: function(data){
			var pageTitle = '';
			var pageType = '';
			try{
				if (typeof data !== 'undefined') {
					if (typeof data.pageTitle !== 'undefined') {
						pageTitle = data.pageTitle;
					}
					if (typeof data.pageType !== 'undefined') {
						pageType = data.pageType;
					}
				}
				fdsInit ();
				eyelight ('trackPageView', pageTitle, pageType);
				console.log ('[pageTitle] '+ pageTitle);
				console.log ('[pageType] '+ pageType);
				console.log (' ==== fnPageView() script complete!! ==== ');
			} catch (e) {
				console.log ('[pageTitle] '+ pageTitle);
				console.log ('[pageType] ' + pageType);
				console.log (' ==== fnPageView() script error!! ==== ');
				console.log ('[error message]' + e.message);
			}
		}
	},
	fnTrackEvent: {
		describe: 'Fds Event Function',
		run: function(data){
			try{
				fdsInit();
	
				// Eyelight Tracker 내부의 timer는 5s 입니다.
				// 아래 타이머는 최소 5s 이상으로 설정되어야 합니다.
				var callbackTimeout = 2000;     // callback timer
				var trackerTimeout = 3000;      // tracker load timer
	
	
				var there = this;
				
				if( typeof this.callbackTimer !== "undefined"){
					clearTimeout(this.callbackTimer);
					this.callbackTimer = null;
				}
				
				if( typeof this.trackerLoadTimer !== "undefined"){
					clearTimeout( this.trackerLoadTimer);
					this.trackerLoadTimer = null;
				}
				
				if( typeof this.eyelightLoaded === "undefined"){
					this.eyelightLoaded = false;
				}
				
				var callback = function (ret) {
					// callback timer가 실행중 eyelight callback이 실행됬을 경우 timer 종료
					clearTimeout(there.callbackTimer);
					
					if( typeof data.callback !== "undefined"){
						try {
							data.callback(ret, arguments[1]);
						} catch (e){
							console.log(' ==== fnTrackEvent() custom callback script error!! ==== ');
							console.log('[error message] '+e.message);
						}
					} else {
					
						if (!ret) {
							console.log(new Date() + ' fdsUtil Log trans Fail!!');
						}
					}
				};
				
				eyelight(function(){
					if( !there.eyelightLoaded) {
						// 트래커가 로딩된 이후 callback timer 시작
						clearTimeout( there.trackerLoadTimer);
						there.callbackTimer = setTimeout(callback, callbackTimeout);
						there.eyelightLoaded = true;
					}
				});
				
				this.trackerLoadTimer = setTimeout( callback, trackerTimeout);
				eyelight('trackEvent', data.cateCd, data.detailCd, data.data, callback);
				
				console.log('[cateCd] '+data.cateCd);
				console.log('[detailCd] '+data.detailCd);
				console.log('[data] '+JSON.stringify(data.data));
				console.log(' ==== fnTrackEvent() script complete!! ==== ');
			} catch (e) {
				console.log('[cateCd] '+data.cateCd);
				console.log('[detailCd] '+data.detailCd);
				console.log('[json to string data] '+JSON.stringify(data.data));
				console.log(' ==== fnTrackEvent() script error!! ==== ');
				console.log('[error message] '+e.message);
			}
		}
	},
	fnTrackPageView: {
		describe: 'Fds TrackPageView Function',
		run: function (data) {
			var pageTitle = '';
			var pageType = '';
			try{
				if (typeof data !== 'undefined') {
					if (typeof data.pageTitle !== 'undefined') {
						pageTitle = data.pageTitle;
					}
					if (typeof data.pageType !== 'undefined') {
						pageType = data.pageType;
					}
				}
				fdsInit ();
				eyelight ('trackPageView', pageTitle, pageType, data.data);
			} catch (e) {
				console.log ('[pageTitle] ' + pageTitle);
				console.log ('[pageType] ' + pageType);
				console.log ('[json to string data] ' + JSON.stringify (data.data));
				console.log (' ==== fnPageView() script error!! ==== ');
				console.log ('[error message]' + e.message);
			}
		}
	},
	constants: {
		// fdsUtils.constants.pageView.pageType.login.value
		describe: 'Fds Logging Constants',
		pageView: {
			pageType: {
				read_order_simple_auth:{
					menuDescription: {
						1: '로그인>비회원주문/배송조회>고객인증'
					},
					value: 'read_order_simple_auth'
				},
				read_order_simple:{
					menuDescription: {
						1: '로그인>비회원주문/배송조회>간편구매 내역 조회'
					},
					value: 'read_order_simple'
				},
				read_order:{
					menuDescription: {
						1: '로그인>비회원주문/배송조회'
					},
					value: 'read_order'
				},
				join:{
					menuDescription: {
						1:'회원가입>CJmall회원가입'
					},
					value: 'join'
				},
				login:{
					menuDescription: {
						1:'로그인>로그인',
						2:'마이존>회원정보>개인정보변경'
					},
					value: 'login'
				},
				read_id:{
					menuDescription: {
						1: '로그인>아이디찾기'
					},
					value: 'read_id'
				},
				read_pw:{
					menuDescription: {
						1: '로그인>비밀번호찾기'
					},
					value: 'read_pw'
				},
				saved_money:{
					menuDescription: {
						1:'마이존>마이존메인화면>나의쇼핑정보>다운가능한적립금바로가기',
						2:'마이존>쇼핑통장>적립금',
						3:'마이존>쇼핑컨텐츠>식품가계부'
					},
					value: 'saved_money'
				},
				point:{
					menuDescription: {
						1:'마이존>마이존메인화면>나의쇼핑정보>다운가능한CJONE포인트바로가기',
						2:'마이존>쇼핑통장>CJONE포인트'
					},
					value: 'point'
				},
				cancel_change_refund:{
					menuDescription: {
						1: '마이존>쇼핑정보>주문취소/교환/반품'
					},
					value: 'cancel_change_refund'
				},
				upd_opt:{
					menuDescription: {
						1: '마이존>쇼핑정보>배송/결제/옵션변경'
					},
					value: 'upd_opt'
				},
				upd_info:{
					menuDescription: {
						1: '마이존>회원정보>개인정보변경'
					},
					value: 'upd_info'
				},
				coupon:{
					menuDescription: {
						1:'마이존>쇼핑통장>쿠폰',
						2:'전시메뉴>쿠폰다운받기',
						3:'전시메뉴>적용쿠폰확인'
					},
					value: 'coupon'
				},
				gift_certificate:{
					menuDescription: {
						1: '마이존>쇼핑통장>상품권',
						2: '마이존>쇼핑컨텐츠>상품권등록'
					},
					value: 'gift_certificate'
				},
				balance:{
					menuDescription: {
						1: '마이존>쇼핑통장>예치금'
					},
					value: 'balance'
				},
				vip_mall:{
					menuDescription: {
						1:'마이존>마이존메인화면>VIP MALL',
					},
					value: 'vip_mall'
				},
				customer_grade_benefit:{
					menuDescription: {
						1:'마이존>마이존메인화면>등급별 혜택',
					},
					value: 'customer_grade_benefit'
				},
				customer_expect_grade:{
					menuDescription: {
						1:'마이존>마이존메인화면>예상등급',
					},
					value: 'customer_expect_grade'
				},
				discount_coupon:{
					menuDescription: {
						1:'마이존>쇼핑통장>쿠폰>할인쿠폰',
					},
					value: 'discount_coupon'
				},
				shopping_plus_coupon:{
					menuDescription: {
						1:'마이존>쇼핑통장>쿠폰>쇼핑플러스쿠폰',
					},
					value: 'shopping_plus_coupon'
				},
				saved_money:{
					menuDescription: {
						1:'마이존>쇼핑통장>적립금',
					},
					value: 'saved_money'
				},
				cjone_point:{
					menuDescription: {
						1:'마이존>쇼핑통장>CJONE 포인트',
					},
					value: 'cjone_point'
				},
				product_qna:{
					menuDescription: {
						1:'마이존>마이존메인화면>나의 상품 Q&A',
					},
					value: 'product_qna'
				},
				product_writable_comment:{
					menuDescription: {
						1:'마이존>쇼핑컨텐츠>상품평 작성/조회>작성 가능한 상품평',
					},
					value: 'product_writable_comment'
				},
				product_writed_comment:{
					menuDescription: {
						1:'마이존>쇼핑컨텐츠>상품평 작성/조회>내가 작성한 상품평',
					},
					value: 'product_writed_comment'
				},
				shopping_notice:{
					menuDescription: {
						1:'마이존>회원정보>쇼핑알리미 설정',
					},
					value: 'shopping_notice'
				},
				faq_cat01:{
					menuDescription: {
						1:'고객센터>자주하는질문>회원'
					},
					value: 'faq_cat01'
				},
				faq_cat02:{
					menuDescription: {
						1: '고객센터>자주하는질문>주문/결제/입금확인'
					},
					value: 'faq_cat02'
				},
				faq_cat03:{
					menuDescription: {
						1: '고객센터>자주하는질문>적립금'
					},
					value: 'faq_cat03'
				},
				faq_cat04:{
					menuDescription: {
						1: '고객센터>자주하는질문>배송'
					},
					value: 'faq_cat04'
				},
				faq_cat05:{
					menuDescription: {
						1: '고객센터>자주하는질문>반품/교환/AS/환불'
					},
					value: 'faq_cat05'
				},
				faq_cat06:{
					menuDescription: {
						1: '고객센터>자주하는질문>증빙'
					},
					value: 'faq_cat06'
				},
				faq_cat07:{
					menuDescription: {
						1: '고객센터>자주하는질문>고객등급/이벤트'
					},
					value: 'faq_cat07'
				},
				faq_cat08:{
					menuDescription: {
						1: '고객센터>자주하는질문>상품'
					},
					value: 'faq_cat08'
				},
				faq_cat09:{
					menuDescription: {
						1: '고객센터>자주하는질문>기타'
					},
					value: 'faq_cat09'
				},
				faq_cat10:{
					menuDescription: {
						1: '고객센터>자주하는질문>톡톡아이디어'
					},
					value: 'faq_cat10'
				},
				list:{
					menuDescription: {
						1: '기획전',
						2: '전시>TV쇼핑',
						3: '전시>CJ오쇼핑플러스',
						4: '전시>백화점',
						5: '전시>패션/언더웨어',
						6: '전시>잡화/스포츠',
						7: '전시>뷰티/보석',
						8: '전시>유아동/도서',
						9: '전시>인테리어/리빙',
						10: '전시>식품',
						11: '전시>가전/디지털',
						12: '전시>여행/보험/서비스',
						13: '오른쪽배너>빠른배송',
						14: '오른쪽배너>스타브랜드',
						15: '오른쪽배너>카탈로그',
						16: '홈>TV쇼핑',
						17: '홈>오클락딜',
						18: '홈>통합기획전',
						19: '홈>백화점',
						20: '홈>기획전',
						21: '홈>편성표'
					},
					value: 'list'
				},
				detail:{
					menuDescription: {
						1: '전시메뉴>상세보기',
						2: '오른쪽배너>최근본상품'
					},
					value: 'detail'
				},
				cart:{
					menuDescription: {
						1: '전시메뉴>장바구니',
						2: '오른쪽배너>장바구니'
					},
					value: 'cart'
				},
				event: {
					menuDescription: {
						1: '홈>이벤트'
					},
					value: 'event'
				},
				search: {
					menuDescription: {
						1: '홈>검색>검색결과리스트'
					},
					value: 'search'
				},
				checkout:{
					menuDescription: {
						1: '전시메뉴>주문서'
					},
					value: 'checkout'
				},
				recent_all:{
					menuDescription: {
						1: '오른쪽배너>최근본상품>전체보기'
					},
					value: 'recent_all'
				}
			}
		},
		event: {
			fdsCateCd: {
				pv:{
					menuDescription: {
						1: '회원가입>CJmall+CJONE통합회원가입'
					},
					value: 'pv'
				},
				join:{
					menuDescription: {
						1: '회원가입>CJmall회원가입>기본정보입력>확인',
						2: '회원가입>CJmall회원가입>기본정보입력>아이디중복체크',
						3: '회원가입>CJmall회원가입>기본정보입력>회원가입요청'
					},
					value: 'join'
				},
				login:{
					menuDescription: {
						1: '로그인>로그인>로그인',
						2: '로그인>로그인>휴면상태체크',
					},
					value: 'login'
				},
				find_id:{
					menuDescription: {
						1: '로그인>아이디찾기>이름,생년월일로찾기>확인',
						2: '로그인>아이디찾기>본인인증으로찾기>휴대폰인증',
						3: '로그인>아이디찾기>본인인증으로찾기>아이핀인증',
						4: '로그인>아이디찾기>등록된휴대폰번호로찾기>인증번호전송',
						5: '로그인>아이디찾기>등록된이메일주소로찾기>인증메일전송',
					},
					value: 'find_id'
				},
				find_pw:{
					menuDescription: {
						1: '로그인>비밀번호찾기>아이디입력>조회',
						2: '로그인>비밀번호찾기>아이디입력>조회>본인인증으로찾기>휴대폰인증',
						3: '로그인>비밀번호찾기>아이디입력>조회>본인인증으로찾기>아이핀인증',
						4: '로그인>비밀번호찾기>아이디입력>조회>등록된휴대폰번호로찾기>인증번호전송',
						5: '로그인>비밀번호찾기>아이디입력>조회>등록된이메일주소로찾기>인증메일전송',
					},
					value: 'find_pw'
				},
				find_pw_try:{
					menuDescription: {
						1: '로그인>비밀번호찾기>아이디입력>조회',
						2: '로그인>비밀번호찾기>아이디입력>조회>본인인증으로찾기>휴대폰인증',
						3: '로그인>비밀번호찾기>아이디입력>조회>본인인증으로찾기>아이핀인증',
						4: '로그인>비밀번호찾기>아이디입력>조회>등록된휴대폰번호로찾기>인증번호전송',
						5: '로그인>비밀번호찾기>아이디입력>조회>등록된이메일주소로찾기>인증메일전송',
					},
					value: 'find_pw_try'
				},
				read_order:{
					menuDescription: {
						1: '로그인>비회원주문/배송조회'
					},
					value: 'read_order'
				},
				logout:{
					menuDescription: {
						1: '로그아웃'
					},
					value: 'logout'
				},
				cart:{
					menuDescription: {
						1: '전시메뉴>상세보기>장바구니담기',
						2: '전시메뉴>장바구니>옵션변경',
						3: '전시메뉴>장바구니>수량변경',
						4: '전시메뉴>장바구니>수량옵션변경',
						5: '마이존>쇼핑컨텐츠>쇼핑찜>장바구니'
					},
					value: 'cart'
				},
				order:{
					menuDescription: {
						1: '상품상세정보>바로구매',
						2: '상품상세정보>미리주문',
						3: '장바구니>구매하기'
					},
					value: 'order'
				},
				checkout:{
					menuDescription: {
						1: '주문서작성>결제하기'
					},
					value: 'checkout'
				},
				purchase:{
					menuDescription: {
						1: '주문서작성>결제완료'
					},
					value: 'purchase'
				},
				customer_grade_benefit:{
					menuDescription: {
						1: '마이존>마이존메인화면>등급별 혜택>나의 혜택 받기'
					},
					value: 'customer_grade_benefit'
				},
				user_info:{
					menuDescription: {
						1: '방송알리미>방송알리미등록'
					},
					value: 'user_info'
				},
				search:{
					menuDescription: {
						1: '홈>통합검색',
						2: '홈>통합검색>검색결과리스트'
					},
					value: 'search'
				},
				qna : {
					menuDescription: {
						1: '상세보기 > Q&A 등록 > 질문하기',
						2: '상세보기 > Q&A 등록 > 답변하기'
					},
					value: 'qna'
				},
				wish : {
					menuDescription: {
						1: '마이존>쇼핑컨텐츠>쇼핑찜',
						2: '전시메뉴>상세보기>쇼핑찜'
					},
					value: 'wish'
				},
				benefit_download_try : {
					menuDescription: {
						1: '마이존>마이존메인화면>등급별 혜택>전체 혜택 받기 시도'
					},
					value: 'benefit_download_try'
				},
				benefit_download : {
					menuDescription: {
						1: '마이존>마이존메인화면>등급별 혜택>전체 혜택 받기'
					},
					value: 'benefit_download'
				},
				user_info_upd_try:{
					menuDescription: {
						1: '마이존>회원정보>방송알리미>나의 휴대폰정보>수정시도'
					},
					value: 'user_info'
				},
				user_info_tv_try:{
					menuDescription: {
						1: '마이존>회원정보>방송알리미>TV쇼핑레터 신청>수정시도'
					},
					value: 'user_info'
				},
				cancel_change_refund:{
					menuDescription: {
						1: '마이존>쇼핑정보>주문취소/교환/반품'
					},
					value: 'cancel_change_refund'
				},
				shopping_notice:{
					menuDescription: {
						1:'마이존>회원정보>쇼핑알리미 설정',
					},
					value: 'shopping_notice'
				},
				user_info_recv_setting_try:{
					menuDescription: {
						1:'마이존>회원정보>쇼핑알리미 설정>TV쇼핑레터 신청',
					},
					value: 'user_info_recv_setting_try'
				},
				upd_opt:{
					menuDescription: {
						1: '마이존>쇼핑정보>배송/결제/옵션변경'
					},
					value: 'upd_opt'
				},
				comment_write_try:{
					menuDescription: {
						1: '마이존>쇼핑컨텐츠>상품평 작성 조회>상품평 쓰기>쓰기 시도'
					},
					value: 'comment_write_try'
				},
				comment_write:{
					menuDescription: {
						1: '마이존>쇼핑컨텐츠>상품평 작성 조회>상품평 쓰기>쓰기'
					},
					value: 'comment_write'
				},
				read_order_nonmember_try:{
					menuDescription: {
						1: '로그인>비회원주문/배송조회 시도'
					},
					value: 'read_order'
				},
				read_order_nonmember:{
					menuDescription: {
						1: '로그인>비회원주문/배송조회'
					},
					value: 'read_order'
				}
			},
			fdsDetailCd: {
				cjone:{
					menuDescription: {
						1: '회원가입>CJmall+CJONE통합회원가입'
					},
					value: 'cjone'
				},
				create_info:{
					menuDescription: {
						1: '회원가입>CJmall회원가입>기본정보입력>확인'
					},
					value: 'create_info'
				},
				dup:{
					menuDescription: {
						1: '회원가입>CJmall회원가입>기본정보입력>아이디중복체크'
					},
					value: 'dup'
				},
				req_join:{
					menuDescription: {
						1: '회원가입>CJmall회원가입>기본정보입력>회원가입요청'
					},
					value: 'dup'
				},
				login:{
					menuDescription: {
						1: '로그인>로그인>로그인'
					},
					value: 'login'
				},
				login_try:{
					menuDescription: {
						1: '로그인>로그인>로그인'
					},
					value: 'login_try'
				},
				agree:{
					menuDescription: {
						1: '로그인>로그인>약관동의'
					},
					value: 'agree'
				},
				agree_try:{
					menuDescription: {
						1: '로그인>로그인>약관동의'
					},
					value: 'agree_try'
				},
				login_upd_pw_period:{
					menuDescription: {
						1: '로그인>로그인>비밀번호 변경안내'
					},
					value: 'login_upd_pw_period'
				},
				login_upd_pw_period_try:{
					menuDescription: {
						1: '로그인>로그인>비밀번호 변경안내'
					},
					value: 'login_upd_pw_period_try'
				},
				quiescence:{
					menuDescription: {
						1: '로그인>로그인>휴면상태체크>본인아이디사용여부확인'
					},
					value: 'quiescence'
				},
				quiescence_try:{
					menuDescription: {
						1: '로그인>로그인>휴면상태체크>본인아이디사용여부확인'
					},
					value: 'quiescence_try'
				},
				find_name_birth:{
					menuDescription: {
						1: '로그인>아이디찾기>이름,생년월일로찾기>확인'
					},
					value: 'find_name_birth'
				},
				find_name_birth_try:{
					menuDescription: {
						1: '로그인>아이디찾기>이름,생년월일로찾기>확인'
					},
					value: 'find_name_birth_try'
				},
				auth_phone_send_num:{
					menuDescription: {
						1: '로그인>아이디찾기>본인인증으로찾기>휴대폰인증>인증번호전송',
						2: '로그인>비밀번호찾기>아이디입력>조회>본인인증으로찾기>휴대폰인증>인증번호전송'
					},
					value: 'auth_phone_send_num'
				},
				auth_phone_verify_num:{
					menuDescription: {
						1: '로그인>아이디찾기>본인인증으로찾기>휴대폰인증>인증번호확인',
						2: '로그인>비밀번호찾기>아이디입력>조회>본인인증으로찾기>휴대폰인증>인증번호확인'
					},
					value: 'auth_phone_verify_num'
				},
				auth_phone:{
					menuDescription: {
						1: '로그인>아이디찾기>본인인증으로찾기>휴대폰인증'
					},
					value: 'auth_phone'
				},
				auth_ipin:{
					menuDescription: {
						1: '로그인>아이디찾기>본인인증으로찾기>아이핀인증',
						2: '로그인>비밀번호찾기>아이디입력>조회>본인인증으로찾기>아이핀인증'
					},
					value: 'auth_ipin'
				},
				auth_ipin_try:{
					menuDescription: {
						1: '로그인>아이디찾기>본인인증으로찾기>아이핀인증',
						2: '로그인>비밀번호찾기>아이디입력>조회>본인인증으로찾기>아이핀인증'
					},
					value: 'auth_ipin'
				},
				find_phone_send_num:{
					menuDescription: {
						1: '로그인>아이디찾기>등록된휴대폰번호로찾기>인증번호전송'
					},
					value: 'find_phone_send_num'
				},
				find_phone_send_num_try:{
					menuDescription: {
						1: '로그인>아이디찾기>등록된휴대폰번호로찾기>인증번호전송'
					},
					value: 'find_phone_send_num_try'
				},
				find_phone_verify_num:{
					menuDescription: {
						1: '로그인>아이디찾기>등록된휴대폰번호로찾기>인증번호확인'
					},
					value: 'find_phone_verify_num'
				},
				find_mail_send_num:{
					menuDescription: {
						1: '로그인>아이디찾기>등록된이메일주소로찾기>인증메일전송'
					},
					value: 'find_mail_send_num'
				},
				find_mail_verify_num:{
					menuDescription: {
						1: '로그인>아이디찾기>등록된이메일주소로찾기>인증메일확인'
					},
					value: 'find_mail_verify_num'
				},
				find_mail_send_num_try:{
					menuDescription: {
						1: '로그인>아이디찾기>등록된이메일주소로찾기>인증메일전송'
					},
					value: 'find_mail_send_num_try'
				},
				read_order_simple_phone_try:{
					menuDescription: {
						1: '로그인>비회원/간편구매조회'
					},
					value: 'read_order_simple_phone_try'
				},
				read_order_simple_phone:{
					menuDescription: {
						1: '로그인>비회원/간편구매조회'
					},
					value: 'read_order_simple_phone'
				},
				id:{
					menuDescription: {
						1: '로그인>비밀번호찾기>아이디입력>조회'
					},
					value: 'id'
				},
				find_phone:{
					menuDescription: {
						1: '로그인>비밀번호찾기>아이디입력>조회>등록된휴대폰번호로찾기>인증번호전송'
					},
					value: 'find_phone'
				},
				find_mail:{
					menuDescription: {
						1: '로그인>비밀번호찾기>아이디입력>조회>등록된이메일주소로찾기>인증메일전송'
					},
					value: 'find_mail'
				},
				read_order_nonmember_try:{
					menuDescription: {
						1: '로그인>비회원주문/배송조회 시도'
					},
					value: 'read_order_nonmember_try'
				},
				read_order_nonmember:{
					menuDescription: {
						1: '로그인>비회원주문/배송조회'
					},
					value: 'read_order_nonmember'
				},
				logout:{
					menuDescription: {
						1: '로그아웃'
					},
					value: 'logout'
				},
				logout_try:{
					menuDescription: {
						1: '로그아웃'
					},
					value: 'logout_try'
				},
				cart_add_try:{
					menuDescription: {
						1: '상품상세정보>장바구니담기시도'
					},
					value: 'cart_add_try'
				},
				cart_add:{
					menuDescription: {
						1: '상품상세정보>장바구니담기'
					},
					value: 'cart_add'
				},
				cart_del_try:{
					menuDescription: {
						1: '장바구니>장바구니삭제시도'
					},
					value: 'cart_del_try'
				},
				cart_del:{
					menuDescription: {
						1: '장바구니>장바구니삭제'
					},
					value: 'cart_del'
				},
				cart_upd_try:{
					menuDescription: {
						1: '장바구니>수량옵션변경시도'
					},
					value: 'cart_upd_try'
				},
				order_cart_try:{
					menuDescription: {
						1: '장바구니>구매하기시도'
					},
					value: 'order_cart_try'
				},
				cart_add_try:{
					menuDescription: {
						1: '장바구니>구매하기시도'
					},
					value: 'cart_add_try'
				},
				order_direct_try:{
					menuDescription: {
						1: '장바구니>구매하기시도'
					},
					value: 'order_direct_try'
				},
				order_cart:{
					menuDescription: {
						1: '장바구니>구매하기'
					},
					value: 'order_cart'
				},
				checkout_try:{
					menuDescription: {
						1: '주문서작성>결제하기시도'
					},
					value: 'checkout_try'
				},
				checkout:{
					menuDescription: {
						1: '주문서작성>결제하기'
					},
					value: 'checkout'
				},
				purchase_try:{
					menuDescription: {
						1: '주문서작성>결제완료시도'
					},
					value: 'purchase_try'
				},
				purchase:{
					menuDescription: {
						1: '주문서작성>결제완료'
					},
					value: 'purchase'
				},
				customer_grade_benefit:{
					menuDescription: {
						1: '마이존>마이존메인화면>등급별 혜택>나의 혜택 받기'
					},
					value: 'customer_grade_benefit'
				},
				user_info_broad_try:{
					menuDescription: {
						1: '방송알리미>방송알리미등록시도',
						2:'방송알리미>나의 휴대폰정보수정시도'
					},
					value: 'user_info_broad_try'
				},
				user_info_broad:{
					menuDescription: {
						1: '방송알리미>방송알리미등록',
						2:'방송알리미>나의 휴대폰정보수정'
					},
					value: 'user_info_broad'
				},
				search:{
					menuDescription: {
						1: '홈>통합검색',
						2: '홈>통합검색>검색결과리스트'
					},
					value: 'search'
				},
				qna_question :{
					menuDescription: {
						1: '상세보기 > Q&A 등록 > 질문하기',
					},
					value: 'qna_question'
				},
				qna_question_try :{
					menuDescription: {
						1: '상세보기 > Q&A 등록 > 질문하기 시도',
					},
					value: 'qna_question_try'
				},
				qna_answer :{
					menuDescription: {
						1: '상세보기 > Q&A 등록 > 답변하기',
					},
					value: 'qna_answer'
				},
				qna_answer_try :{
					menuDescription: {
						1: '상세보기 > Q&A 등록 > 답변하기 시도',
					},
					value: 'qna_answer_try'
				},
				wish_add_try : {
					menuDescription: {
						1: '상세보기 > 찜 시도'
					},
					value: 'wish_add_try'
				},
				wish_add : {
					menuDescription: {
						1: '상세보기 > 찜'
					},
					value: 'wish_add'
				},
				benefit_download_try : {
					menuDescription: {
						1: '마이존>마이존메인화면>등급별 혜택>전체 혜택 받기 시도'
					},
					value: 'benefit_download_try'
				},
				benefit_download : {
					menuDescription: {
						1: '마이존>마이존메인화면>등급별 혜택>전체 혜택 받기'
					},
					value: 'benefit_download'
				},
				user_info_upd_try:{
					menuDescription: {
						1: '마이존>회원정보>방송알리미>나의 휴대폰정보>수정시도',
						2: '전시메뉴>방송알리미>나의 휴대폰 정보>수정시도'
					},
					value: 'user_info_upd_try'
				},
				user_info_recv_setting_try:{
					menuDescription: {
						1: '마이존>회원정보>방송알리미>TV쇼핑레터 신청>수정시도'
					},
					value: 'user_info_recv_setting_try'
				},
				cancel_try:{
					menuDescription: {
						1: '마이존>주문취소/교환/반품>주문취소>주문취소 시도'
					},
					value: 'cancel_try'
				},
				cancel:{
					menuDescription: {
						1: '마이존>주문취소/교환/반품>주문취소>주문취소'
					},
					value: 'cancel'
				},
				certificate_try:{
					menuDescription: {
						1: '마이존>주문취소/교환/반품>주문취소>계좌인증 시도'
					},
					value: 'certificate_try'
				},
				certificate:{
					menuDescription: {
						1: '마이존>주문취소/교환/반품>주문취소>계좌인증'
					},
					value: 'certificate'
				},
				change_try:{
					menuDescription: {
						1: '마이존>주문취소/교환/반품>주문취소>교환신청 시도'
					},
					value: 'change_try'
				},
				change:{
					menuDescription: {
						1: '마이존>주문취소/교환/반품>교환신청>교환신청'
					},
					value: 'change'
				},
				refund_try:{
					menuDescription: {
						1: '마이존>주문취소/교환/반품>반품신청>반품신청 시도'
					},
					value: 'refund_try'
				},
				refund:{
					menuDescription: {
						1: '마이존>주문취소/교환/반품>반품신청>반품신청'
					},
					value: 'refund'
				},
				wish_del_try:{
					menuDescription: {
						1: '마이존>쇼핑컨텐츠>쇼핑찜>삭제하기 시도'
					},
					value: 'wish_del_try'
				},
				wish_del:{
					menuDescription: {
						1: '마이존>쇼핑컨텐츠>쇼핑찜>삭제하기 시도'
					},
					value: 'wish_del'
				},
				shopping_notice:{
					menuDescription: {
						1:'마이존>회원정보>쇼핑알리미 설정',
					},
					value: 'shopping_notice'
				},
				user_info_tv_try:{
					menuDescription: {
						1:'마이존>회원정보>쇼핑알리미 설정>TV쇼핑레터 신청',
					},
					value: 'user_info_tv_try'
				},
				upd_opt_try:{
					menuDescription: {
						1: '마이존>배송/결제/옵션변경>신용카드로 결제변경 시도'
					},
					value: 'upd_opt_try'
				},
				comment_write_try:{
					menuDescription: {
						1: '마이존>쇼핑컨텐츠>상품평 작성 조회>상품평 쓰기>쓰기 시도'
					},
					value: 'comment_write_try'
				},
				comment_write:{
					menuDescription: {
						1: '마이존>쇼핑컨텐츠>상품평 작성 조회>상품평 쓰기>쓰기'
					},
					value: 'comment_write'
				},
				user_info_upd:{
					menuDescription: {
						1: '전시메뉴>방송알리미>나의 휴대폰 정보>수정'
					},
					value: 'user_info_upd'
				}
			} // /fdsDetailCd
		} // /event
	}// /constants
};// /return module