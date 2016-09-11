var userAgentUtil		= require ('common/cjos/util/userAgentUtil'),
	jspVariables		= require ('common/cjos/util/jspVariables'),
	eventProxyManager	= require ('common/cjos/util/eventProxyManager'),
	eventProxyTypes		= require ('common/cjmall/util/p/eventProxyTypes'),
	template 			= require ('common/cjmall/ui/p/rightWing/templates/rightWingView.handlebars');


var View = Backbone.View.extend ({

	el: '#right_wing',
	template: null,
	
	$wnd: $ (window),
	$footer: null,
	$topEvent: null,
	$goTopBtn: null,
	$followWrap: null,
	
	minWidth: 1070,
	elTop: 0,
	elH: 0,
	elBound: 0,
	topEventH: 0,
	followMarginTop: 10,
	followH: 0,
	followFixedStartPos: 0,
	goBtnMarginTop: 14,
	goBtnBottom: 50,
	goBtnH: 0,
	goBtnBound: 0,
	ww: 0,
	wh: 0,
	st: 0,

	initialize: function () {
		var s = this;
		s.template = template;
		s.render ();
		
		var d1 = $.Deferred (), 
			d2 = $.Deferred (); 
		
		$.when (d1, d2).done (function (d1res) {
			s.$footer = $ ('#cjm_footer');
			setTimeout (function () {
				s.setData ();
			}, 25);
		});
		
		// 모든 이미지 로드 체크
		var $imgs = s.$el.find ('img'),
			loadCnt = 0;
		for (var i = 0, len = $imgs.length; i < len; i++) {
			var $img = $imgs.eq (i);
			if ($img[0].complete) {
				continue;
			}
			
			loadCnt ++;
			$img.on ('error load', imgloadHn);
		}
		if (loadCnt === 0) {
			d1.resolve ('#right_wing :: all img loaded');
		}
		
		// footer rendered deffered
		eventProxyManager.listen (eventProxyTypes.RENDERED_FOOTER, function () {
			d2.resolve ('Rendered footer');
		});
		
		function imgloadHn (e) {
			loadCnt--;
			if (loadCnt === 0) {
				d1.resolve ('#right_wing :: all img loaded');
			}
		}
	},
	
	setData: function () {
		var s = this,
			$el = s.$el;
		
		s.$topEvent = $el.find ('.top_event');
		s.$goTopBtn = $el.find ('.go_top');
		s.$followWrap = $el.find ('.follow_wrap');
		
		s.elTop = $el.offset ().top;
		s.topEventH = s.$topEvent.height ();
		s.goBtnH = s.$goTopBtn.height ();
		s.goBtnBound = s.goBtnMarginTop + s.goBtnH + s.goBtnBottom;
		
		s.followH = s.$followWrap.outerHeight () + s.goBtnBound;
		s.followFixedStartPos = s.elTop + s.topEventH;
		
		s.elH = $el.outerHeight () + s.goBtnBound;
		
		s.storeWindowSize ();
		s.storeScrollTopPosition ();
		s.updatePosition ();
		
		s.$goTopBtn.show ();
		
		s.addEventListeners ();
	},
	
	addEventListeners: function () {
		var s = this,
			$wnd = s.$wnd;
		
		$wnd.on ('resize', _.bind (s.resizeHn, s));
		$wnd.on ('scroll', _.bind (s.scrollHn, s));
	},
	
	storeWindowSize: function () {
		var s = this,
			$wnd = s.$wnd;
		
		s.ww = $wnd.outerWidth ();
		s.wh = $wnd.outerHeight ();
	},
	
	storeScrollTopPosition: function () {
		var s = this;
		s.st = s.$wnd.scrollTop ();
	},
	
	resizeHn: function (e) {
		var s = this;
		s.storeWindowSize ();
		s.updatePosition ();
	},

	scrollHn: function (e) {
		var s = this;
		s.storeScrollTopPosition ();
		s.updatePosition ();
	},
	
	updatePosition: function () {
		var s = this,
			$el = s.$el,
			$footer = s.$footer,
			$followWrap = s.$followWrap,
			$goTopBtn = s.$goTopBtn;
		
		$el.css ({display: 'none'});
		if (s.ww < s.minWidth) {
			s.isFollowFixed = false;
			$followWrap.removeAttr ('style');
			$goTopBtn.removeClass ('fixed').css ({position: 'absolute', bottom: -1 * (s.goBtnBottom + 10)});
		} else {
			var st = s.st,
				wh = s.wh,
				followH = s.followH,
				followMarginTop = s.followMarginTop,
				goBtnBottom = s.goBtnBottom,
				footerOffsetTop, 
				footerVisibleH, // 푸터의 현재 가시영역크기
				displayBound,
				isFollowFixed = false;  // 푸터를 제외한 가시영역크기
			
			footerOffsetTop = $footer.offset ().top;
			footerVisibleH = st + wh - footerOffsetTop; 
			footerVisibleH = (footerVisibleH < 0) ? 0 : footerVisibleH;
			displayBound = wh - footerVisibleH;
			
			if (st < s.followFixedStartPos) {
				s.isFollowFixed = false;
				$followWrap.removeAttr ('style');
			} else {
				s.isFollowFixed = true;
				if (followH <= displayBound) {
					$followWrap.css ({position: 'fixed', top: followMarginTop});
				} else {
					var adjustH = followH - displayBound;
					$followWrap.css ({position: 'fixed', top: followMarginTop - adjustH});
				}
			}
			var compareH = (s.isFollowFixed) ? followH : s.elH - (st - s.elTop);
			if (compareH <= displayBound) {
				$goTopBtn.addClass ('fixed').css ({position: 'fixed', bottom: goBtnBottom + footerVisibleH});
			} else {
				$goTopBtn.removeClass ( 'fixed' ).css ({position: 'absolute', bottom: -1 * (goBtnBottom + 10)});
			}
		}
		
		$el.css ({display: 'block'});
	},

	render: function () {
		var s = this,
			$el = s.$el,
			data = {
				ecStaticBaseUrl: jspVariables.get ('ecStaticBaseUrl')
			};
		
		$el.html (s.template (data));
	}
});

module.exports = View;