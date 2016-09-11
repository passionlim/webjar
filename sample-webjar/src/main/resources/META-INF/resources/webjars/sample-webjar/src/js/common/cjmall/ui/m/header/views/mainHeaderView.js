/**
 * CJmall 모바일 > 메인 헤더뷰
 * 
 * @module common/cjmall/ui/m/header/views/mainHeaderView
 * 
 * @requires module:common/cjos/util/commonUtil
 * @requires module:common/cjos/util/userAgentUtil
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjos/util/eventProxyManager
 * @requires module:common/cjos/util/dateUtil
 * @requires module:common/cjos/util/urlUtil
 * @requires module:common/cjos/util/m/appTransfer
 * @requires module:common/cjmall/util/m/eventProxyTypes
 * @requires module:common/cjmall/util/m/jsConstants
 * @requires module:common/cjmall/ui/m/header/collections/mainHeaderCollection
 * @requires module:common/cjmall/ui/m/header/templates/mainHeaderView.handlebars
 * @requires module:common/cjmall/ui/m/header/templates/mainHeaderView_menu.handlebars
 */
// import
var commonUtil				= require ('common/cjos/util/commonUtil');
var userAgentUtil			= require ('common/cjos/util/userAgentUtil');
var jspVariables			= require ('common/cjos/util/jspVariables');
var eventProxyManager		= require ('common/cjos/util/eventProxyManager');
var dateUtil				= require ('common/cjos/util/dateUtil');
var urlUtil					= require ('common/cjos/util/urlUtil');
var appTranfer				= require ('common/cjos/util/m/appTransfer');
var cjmallMEventProxyTypes	= require ('common/cjmall/util/m/eventProxyTypes');
var cjmallJsContants		= require ('common/cjmall/util/m/jsConstants');
var MainHeaderCollection	= require ('common/cjmall/ui/m/header/collections/mainHeaderCollection');
var template				= require ('common/cjmall/ui/m/header/templates/mainHeaderView.handlebars');
var menuTemplate			= require ('common/cjmall/ui/m/header/templates/mainHeaderView_menu.handlebars');

// view
var View = Backbone.View.extend ( {
	
	el: '#o1h_header_wrap',
	template: null,
	menuTemplate: null,
	events: {
		'click .search_wrap .btn_sch': 'searchHn',
		'focusin .search_wrap input': 'searchHn',
		'click .n_top .btn_side': 'openLeftHn',
		'click .n_top_banner .btn_close': 'closeAppBannerHn',
		'click .n_top_banner .btn_download': 'goCJmallAppHn'
	},
	
	collection: null,
	APP_BANNER_CLOSE_DATE: cjmallJsContants.COOKIE_KEYS.APP_BANNER_CLOSE_DATE,
	
	$wnd: $ (window),
	$doc: $ (document),
	$menuContainer: null,
	$headerMenu: null,
	menuArr: null,
	offsetXArr: null,
	
	headerState: 0,
	topHeight: 0,
	currentIndex: -1,
	
	initialize: function () {
		var s = this;
		var	collection = new MainHeaderCollection ();
		
		s.template = template;
		s.menuTemplate = menuTemplate;
		s.initRender ();
	
		s.collection = collection;
		s.listenTo (collection, 'update', s.render);
		collection.update ();
	},
	
	addEventListeners: function () {
		var s = this;
		var	$wnd = s.$wnd;
		
		$wnd.on ('resize', _.bind (s.resizeHn, s));
		//$wnd.on ( 'scroll', _.bind ( s.scrollHn, s ) );
		eventProxyManager.listen (cjmallMEventProxyTypes.MAIN__ADD_FIXED_TAB, _.bind (s.categoryTabFixedHn, s));
		eventProxyManager.listen (cjmallMEventProxyTypes.MAIN__DEL_FIXED_TAB, _.bind (s.categoryTabFixedCancelHn, s));
	},
	
	initView: function () {
		var s = this;
		var	$menus = s.$menuContainer.find ('> li');
		var	menuArr = [];
		var	curIndex = -1;
		
		for (var i = 0, len = $menus.length; i < len; i++) {
			var $menu = $menus.eq (i);
			
			menuArr.push ($menu);
			if ($menu.find ('> a').hasClass ('on')) {
				curIndex = i;
			}
		}
		
		s.topHeight = s.$top.outerHeight ();
		s.menuArr = menuArr;
		s.currentIndex = curIndex;
		
		s.setFixed ();
		s.setTotalWidth ();
		s.setHScroll ();
		s.setInitScrollHPosition ();
		
		$ ('#o1h_center').css ({paddingTop: s.$el.outerHeight ()});
	},
	
	updateView: function () {
		var s = this;
		s.setTotalWidth ();
		s.scroll.refresh ();
		s.updateScrollHPosition ();
	},
	
	categoryTabFixedHn: function () {
		this.$headerMenu.addClass ('cate_fixed');
	},
	
	categoryTabFixedCancelHn: function () {
		this.$headerMenu.removeClass ('cate_fixed');
	},
	
	setFixed: function () {
		var s = this;
		var	$el = s.$el;
		var	$wnd = s.$wnd;
		var	$doc = s.$doc;
		var	$top = s.$top;
		
		if (jindo.m.useFixed ()) {
			$el.css ({position: 'fixed', top: 0, left: 0, right: 0, zIndex: 501});
		} else {
			var st = $doc.scrollTop ();
			$el.css ({position: 'absolute', width: '100%', top: st, zIndex: 501});
			$wnd.on ('scroll', function () {
				st = $doc.scrollTop ();
				$el.css ({top: st});
			});
		}
	},
	
	setTotalWidth: function () {
		var s = this;
		var	menuArr = s.menuArr;
		var	totalWidth = 0;
		var	offsetXArr = [];
		
		for (var i = 0, len = menuArr.length; i < len; i++) {
			var $menu = menuArr [i];
			var	menuWidth = $menu.outerWidth ();
			
			offsetXArr.push (totalWidth);
			totalWidth += menuWidth;
		}
		s.offsetXArr = offsetXArr;
		s.$menuContainer.css ({width: totalWidth + 5});
	},
	
	setHScroll: function () {
		var s = this;
		var	$menuContainer = s.$menuContainer;
		
		s.scroll = new jindo.m.Scroll ('headerMenu', {
			bUseHScroll: true,
			bUseVScroll: false,
			bUseScrollbar: false,
			nHeight: $menuContainer.parent ().height ()
		});
	},
	
	setInitScrollHPosition: function () {
		var s = this;
		var	$el = s.$el;
		var	curIdx = s.currentIndex;
		
		if (curIdx > -1) {
			var $targetMenu = s.menuArr [curIdx];
			var	offsetX = s.offsetXArr [curIdx];
			var	centerPos = Math.ceil ($el.width () * 0.5) - Math.ceil ($targetMenu.outerWidth () * 0.5);
			var	targetScrollTo = (offsetX > centerPos) ? offsetX - centerPos : 0;
	
			s.scroll.scrollTo (targetScrollTo);
		}
	},
	
	updateScrollHPosition: function () {
		var s = this;
		var	$el = s.$el;
		var	scroll = s.scroll;
		var	elW = $el.width ();
		var	currentPosX = scroll.getCurrentPos ().nLeft;
		var	totalWidth = s.$menuContainer.outerWidth ();
		var	limitPos = elW - totalWidth;
	
		if (currentPosX < limitPos) {
			scroll.scrollTo (limitPos);
		}
	},
	
	checkWrapperFixed: function (st) {
		var topH = this.topHeight;
		if (st <= topH) {
			if (st < 0) {
				return 0;
			}
			return -st;
		} else {
			return -topH;
		}
	},
	
	searchHn: function (e) {
		e.preventDefault ();
		var $cur = $ (e.currentTarget);
		var	searchURL = jspVariables.get ('mobileUrl') + '/m/search/searchMain?pic=search' + jspVariables.get ('defaultAndParam');
	
		if ($cur.is ('input')) {
			$cur.blur ();
		}
		
		location.href = searchURL;
	},
	
	openLeftHn: function (e) {
		e.preventDefault ();
		eventProxyManager.trigger (cjmallMEventProxyTypes.CLICK_CATEGORY);
	},
	
	scrollHn: function ( e ) {
		var s = this;
		var	st = s.$wnd.scrollTop ();
		var	state = s.checkWrapperFixed ( st );
		
		if (state !== s.headerState) {
			s.headerState = state;
			s.$el.css ({top: state});
		}
	},
	
	resizeHn: function (e) {
		this.updateView ();
	},
	
	// 앱다운로드배너 닫기
	closeAppBannerHn: function (e) {
		e.preventDefault ();
		var s = this;
		var	$appBanner = s.$el.find ('.n_top_banner');
		
		Cookies.set (s.APP_BANNER_CLOSE_DATE, dateUtil.format ('ymd'), {expires: 1, domain: 'cjmall.com', path: '/'}); // 현재날짜쿠키에 저장
	
		if ($appBanner.length) {
			$appBanner.remove ();
		}
		eventProxyManager.trigger (cjmallMEventProxyTypes.CHANGED_HEADER_HEIGHT);
	},
	
	goCJmallAppHn: function (e) {
		e.preventDefault ();
		appTranfer.appTransfer ('cjmall', 'cjmallapp://home');
	},
	
	initRender: function () {
		var mainUrl = urlUtil.setParamToURLString(jspVariables.get ('mobileUrl') + '/m/main.jsp?pic=logo', 'app_cd', jspVariables.get ('appCd'));
		var s = this;
		var	$el = s.$el;
		var	isShowAppBanner = (Cookies.get (s.APP_BANNER_CLOSE_DATE) !== dateUtil.format ('ymd') && !userAgentUtil.getIsCjmallApp ());
		var data = {menus: [], firtMenuHasFlag: false, isShowAppBanner: isShowAppBanner, homeLink : mainUrl};
		
		$el.html (s.template (data));
		s.$top = $el.find ('.n_top');
		s.$headerMenu = $el.find ('#headerMenu');
		s.$menuContainer = $el.find ('#headerMenu > .n_navi');
	},
	
	render: function () {
		var s = this;
		var	menus = s.collection.toJSON ();
		var	$menuContainer = s.$menuContainer;
		var	data = {menus: menus};
			
		if (menus.length && menus [0].flag && menus [0].flag !== 'N') {
			s.$menuContainer.addClass ('flag_first');
		}
		
		s.$menuContainer.html (s.menuTemplate (data));
		s.initView ();
		s.addEventListeners ();
		
		// ios일 경우에 이벤트를 이벤트딜리게이션형태로 걸경우 root엘레먼트가 클릭영역으로 잡힘.
		if (userAgentUtil.getOs () === 'ios') {
			var tapHighlightColorStyle = s.$el.css ('-webkit-tap-highlight-color');
			s.$el.css ('-webkit-tap-highlight-color', 'transparent');
			s.$el.find ('a, input, button').css ('-webkit-tap-highlight-color', tapHighlightColorStyle);
		}
	}
});

module.exports = commonUtil.getSingleton (View);