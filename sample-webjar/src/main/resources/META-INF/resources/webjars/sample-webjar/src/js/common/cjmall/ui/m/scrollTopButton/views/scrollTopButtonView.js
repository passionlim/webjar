/**
 * CJmall 모바일 맨위로 버튼뷰
 * 
 * [APP일 경우]
 * 1. 네이티브 영역은 모두 앱에서 top 버튼 노출함
 * 2. 상품상세, 묶음코드상세, 보험은 웹에서 top 버튼 노출함
 * 3. 하단 메뉴가 있는 부분은 앱에서 노출한다고 보면됨
 * 
 * @module common/cjmall/ui/m/scrollTopButton/views/scrollTopButtonView
 * 
 * @requires module:common/cjos/util/commonUtil
 * @requires module:common/cjos/util/userAgentUtil
 */
// import
var commonUtil	  = require ('common/cjos/util/commonUtil');
var userAgentUtil = require ('common/cjos/util/userAgentUtil');

// View
var View = Backbone.View.extend ({
	tagName: 'a',
	className: 'fixed_btns scroll_top',
	
	$wnd: $ ( window ),
	$doc: $ ( document ),
	btnWidth: 48,
	btnHeight: 50,
	bottomMargin: 46,
	useFixed: jindo.m.useFixed (),
	isIng: false,
	
	initialize: function () {
		var s = this;
		if (userAgentUtil.getIsCjmallApp ()) {
			var pathName = location.pathname;
			var detailReg = /\/m\/item\/[^/]+$/; // 상품상세
			var mocodeReg = /mocode\/M\d*/i; // 묶음코드상세
		
			if (!mocodeReg.test (pathName) && !detailReg.test (pathName)) {
				return;
			}
		}
		s.render ();
		s.addEventListeners ();
		s.show ();
	},
	
	addEventListeners: function () {
		var s = this;
		
		s.$el.on ('click', _.bind (s.btnClickHn, s));
		s.$wnd.on ('scroll', _.bind (s.scrollHn, s));
	},
	
	show: function () {
		var s = this;
		var $el = s.$el;
		
		if (s.isIng) {
			return;
		}
		
		if (s.$doc.scrollTop () < 50) {
			s.hide ();
			return;
		}
		
		s.isIng = true;
		
		if (s.useFixed) {
			$el.stop ().fadeIn (function () {
				s.isIng = false;
			});
		} else {
			$el.stop ().fadeIn (0);
			s.isIng = false;
		}
	},
	
	hide: function () {
		var s = this;
		var $el = s.$el;
		
		if (s.useFixed) {
			$el.stop ().fadeOut ();
		} else {
			$el.stop ().fadeOut (0);
		}
	},
	
	btnClickHn: function (e) {
		e.preventDefault ();
		this.$doc.scrollTop (0);
	},
	
	setAbsolutePos: function () {
		var s = this;
		var st = s.$doc.scrollTop ();
		var clientH = s.$wnd.height ();
		var targetTop = st + clientH - s.btnHeight - s.bottomMargin;

		s.$el.css ({position: 'absolute', top: targetTop});
	},
	
	scrollHn: function (e) {
		var s = this;
		s.show ();
		
		if (!s.useFixed) {
			s.setAbsolutePos ();
		}
	},
	
	render: function () {
		var s = this;
		var $el = s.$el;
		
		$el.html ('맨위로');
		$el.attr ('spcid', 'btn_top');
		$el.css ({position: 'fixed', zIndex: 999, right: 7, bottom: s.bottomMargin});
		
		if (!s.useFixed) {
			s.setAbsolutePos ();
		}
		
		$el.hide ();
		$ ( '#o1h_wrap' ).after ($el);
	}
});

module.exports = commonUtil.getSingleton (View);