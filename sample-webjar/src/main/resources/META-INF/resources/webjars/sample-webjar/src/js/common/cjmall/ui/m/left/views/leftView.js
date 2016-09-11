/**
 * CJmall 모바일 좌측메뉴
 * 
 * @module common/cjmall/ui/m/left/views/leftView
 * 
 * @requires module:common/cjos/util/commonUtil
 * @requires module:common/cjos/util/userAgentUtil
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjos/util/eventProxyManager
 * @requires module:common/cjos/util/loginUserDetailInfo
 * @requires module:common/cjmall/util/m/eventProxyTypes
 * @requires module:common/cjmall/util/m/jsConstants
 * @requires module:common/cjmall/ui/m/dimmed/views/dimmedView
 * @requires module:common/cjmall/ui/m/left/views/leftCategoryView
 * @requires module:common/cjmall/ui/m/left/views/leftRecentView
 * @requires module:common/cjmall/ui/m/left/models/categoryModel
 * @requires module:common/cjmall/ui/m/left/templates/leftView.handlebars
 */
// import
var commonUtil				= require ('common/cjos/util/commonUtil');
var userAgentUtil			= require ('common/cjos/util/userAgentUtil');
var jspVariables			= require ('common/cjos/util/jspVariables');
var eventProxyManager		= require ('common/cjos/util/eventProxyManager');
var loginUserDetailInfo		= require ('common/cjos/util/loginUserDetailInfo');
var cjmallMEventProxyTypes	= require ('common/cjmall/util/m/eventProxyTypes');
var cjmallJsContants		= require ('common/cjmall/util/m/jsConstants');
var DimmedView				= require ('common/cjmall/ui/m/dimmed/views/dimmedView');
var LeftCategoryView		= require ('common/cjmall/ui/m/left/views/leftCategoryView');
var LeftRecentView			= require ('common/cjmall/ui/m/left/views/leftRecentView');
var CategoryModel			= require ('common/cjmall/ui/m/left/models/categoryModel');
var template				= require ('common/cjmall/ui/m/left/templates/leftView.handlebars');

// leftView
var View = Backbone.View.extend ( {
	
	el: '#o1h_left',
	template: null,
	visible: false, // 뷰가 화면에 보이는지 여부
	userDetailInfo: null,
	events: {
		'touchmove .n_left_log': 'preventEvent', 
		'touchmove .n_left_line': 'preventEvent',
		'click .close_leftmenu': 'closeHn',
		'click .oclock > a': 'appTransferHn'
	},
	initialize: function () {
		var s = this;
		if (userAgentUtil.getIsCjmallApp ()) {
			return;
		}
		
		var	$wnd = $ (window);
		var	dimmed = new DimmedView ();
		
		s.template = template;
		s.$wnd = $wnd;
		s.dimmed = dimmed;
		s.oTransition = new jindo.m.Transition ();
	
		$ ('#o1h_wrap').after (dimmed.$el);
		
		eventProxyManager.listen (cjmallMEventProxyTypes.CLICK_CATEGORY, _.bind (s.show, s));
		$wnd.on ('resize', _.bind (s.resizeHn, s));
		
		s.dimmedEventHn ();
		s.render ();
	},
	
	show: function () {
		var s = this;
		var	dimmed = s.dimmed;
		var $el = s.$el; 
		
		s.visible = true;
		s.setHeightValue ();
		s.oScroll.refresh ();
		
		dimmed.show (300);
		if (jindo.m.useCss3d ()) {
			s.oTransition.queue ($el.get (0), 300, { 
				htTransform: {'transform': 'translate3d(300px,0px,0px)'},
			}).start ();
		} else {
			$el.stop ().animate ({left: 0});
		}
		
		if (!s.userDetailInfo) {
			loginUserDetailInfo.get (function (info) {
				s.userDetailInfo = info;
				s.renderUserInfo ();
			});
		}
	},
	
	hide: function () {
		var s = this;
		var	dimmed = s.dimmed;
		var	$el = s.$el;
	
		s.visible = false;
		if (jindo.m.useCss3d ()) {
			s.oTransition.queue ($el.get (0), 300, {
				htTransform: {'transform': 'translate3d(0px,0px,0px)'},
				fCallback: function () {
					dimmed.hide (300);
				} 
			}).start ();
		} else {
			$el.stop ().animate ({left: -300}, function () {
				dimmed.hide (400);
			});
		}
	},
	
	dimmedEventHn: function () {
		var s = this;
		var	dimmed = s.dimmed;
		var	$dimEl = dimmed.$el;
		
		$dimEl.on ('click', function (e) {
			e.preventDefault ();
			s.hide ();
		});
	},
	
	closeHn: function (e) {
		e.preventDefault ();
		this.hide ();
	},
	
	setHeightValue: function () {
		var s = this;
		var	$wnd = s.$wnd;
		var	$el = s.$el;
		var	clientH = $wnd.height ();
		var	targetH = clientH - 46;
	
		$el.find ('.n_leftmenu_list').css ({height: targetH}); 
		$el.find ('.scrollTarget').css ({minHeight: targetH});
	},
	
	resizeHn: function (e) {
		var s = this;
		var	dimmed = s.dimmed;
		var	$el = s.$el;
		var	oScroll = s.oScroll; 
	
		if (!s.visible) {
			return;
		}
		
		s.setHeightValue ();
		oScroll.refresh ();
	},
	
	appTransferHn: function (e) {
		e.preventDefault ();
	},
	
	preventEvent: function (e) {
		e.preventDefault ();
	},
	
	renderUserInfo: function () {
		var s = this;
		var	mobileUrl = jspVariables.get ('mobileUrl');
		var	mobileSslUrl = jspVariables.get ('mobileSslUrl');
		var	defaultAndParam = jspVariables.get ('defaultAndParam');
		var	$logView = s.$el.find ( '.n_left_log > dt');
		var	userInfo = s.userDetailInfo;
		
		// 고객명 노출 및 로그인링크 노출
		if (userInfo.isLogin) {
			$logView.html ('<span><em>' + userInfo.custNm + '</em>님</span>');
	
			// 임직원몰 버튼 및 회원등급 추가
			if ( userInfo.isEmployee ) {
				var mallUrl = mobileUrl + '/m/shop/planshop/plan_shop.jsp?shop_id=2013101508' + defaultAndParam;
				$logView.append ('<a href="' + mallUrl + '&pic=btn_B2E1" class="btn_family">임직원몰</a>');
			} else {
				var gradeUrl = mobileUrl + '/m/mycj/customerGradeBenefit.jsp?pic=btn_mem1' + defaultAndParam,
					$grade = $ ('<a href="' + gradeUrl + '" class="btn_grade">플래티넘R</a>'),
					gradeClass = '',
					gradeName = '';
				
				switch (userInfo.segCd) {
					case 'A0107010': // 패밀리
						gradeName = '패밀리';
						gradeClass = 'fam';
						break;
					case 'A0106010': // 실버
						gradeName = '실버';
						gradeClass = 'silver';
						break;
					case 'A0104010': // 골드
						gradeName = '골드';
						gradeClass = 'gold';
						break;
					case 'A0105010': // 플래티넘 A
						gradeName = '플래티넘A';
						gradeClass = 'pa';
						break;
					case 'A0105000': // 플래티넘 R
						gradeName = '플래티넘R';
						gradeClass = 'pr';
						break;
					case 'A0105006': // 플래티넘 S
						gradeName = '플래티넘S';
						gradeClass = 'ps';
						break;
					default:
						gradeName = '패밀리';
						gradeClass = 'fam';
						break;
				}
				$grade.text (gradeName);
				$grade.addClass (gradeClass);
				$logView.append ($grade); 
			}
		} else {
			$logView.html ('<a href="#" data-module="common/cjutil/util" data-event="click" data-method="goLoginPage">로그인</a><em></em>');
		}
	},
	
	render: function () {
		var s = this;
		var	$el = s.$el;
		var	jsGlobal = cjmallJsContants.GLOBAL;
		var	domain = cjmallJsContants.DOMAIN;
		var	data = {
				isApp: userAgentUtil.getIsCjmallApp (),
				defaultAndParam: jspVariables.get ('defaultAndParam'),
				mobileUrl: jspVariables.get ('mobileUrl'),
				onmartDomain: domain.CJONMART,
				oliveyoungDomain: domain.OLIVEYOUNGSHOP,
				firstlookDomain: domain.FIRSTLOOK,
				getItBeautyDomain: domain.GETITBEAUTY
			};
	
		$el.css ({position: 'fixed', top: 0});
		$el.html (s.template (data));
		
		s.categoryView = new LeftCategoryView ();
		s.recentItemView = new LeftRecentView ();
		s.$contentWrapper = $ ('#o1h_center');
		
		s.setHeightValue ();
		var oScroll = new jindo.m.Scroll("view", {
			bUseScrollbar: false,
			bAutoResize: true
		}).attach ({
			'beforeTouchStart': function (e) {
				if (!oScroll.hasVScroll ()) {
					e.stop ();
				}
			}
		});
		
		s.oScroll = oScroll;
	}
});

module.exports = commonUtil.getSingleton (View);