var	jspVariables 			= require ('common/cjos/util/jspVariables');
var	jqueryPluginManager 	= require ('common/cjos/util/jqueryPluginManager');
var	jqueryCircularRolling 	= require ('common/cjos/util/p/circularRolling');
var	template 	 			= require ('common/cjmall/ui/p/header/templates/headerView.handlebars' );
	


var View = Backbone.View.extend ( {

	el: '#header_wrap',
	template: null,

	initialize: function () {
		var s = this;
		s.template = template;
		s.render ();
		s.initView ();
	},

	initView: function () {
		var s = this,
			$el = s.$el,
			$gnb = $el.find ('.gnb'),
			firstMenu = $el.find ('.big_menu > li > a'),
			firstMenuWrap = $el.find ('.big_menu'),
			indivisualSubmenu = $el.find ('.big_menu li dl'),
			subMenu = $el.find ('.sub_menu'),
			seeAllBtn = $el.find ('.gnb .see_all');
			
		firstMenu.each (function (i) {
			$(this).mouseenter (function () {
				subMenu.hide ();
				seeAllBtn.removeClass ('on');
				indivisualSubmenu.hide ();
				$(this).next (indivisualSubmenu).show ();
			});
			
			$gnb.mouseleave (function () {
				indivisualSubmenu.hide ();
				subMenu.hide ();
				seeAllBtn.removeClass ('on');
			});
	
			seeAllBtn.click (function () {
				if (seeAllBtn.hasClass ('on') === true) {
					subMenu.hide ();
					seeAllBtn.removeClass ('on');
				} else {
					seeAllBtn.addClass ('on');
					indivisualSubmenu.hide ();
					subMenu.show ();
				}
				return false;
			});
		});
		
		//util
		var utilMenu = $el.find ('.util .has_sub'),
			utilMenuTit = $el.find ('.util .has_sub > a'),
			utilSub = $el.find ('.has_sub ul');
			
		utilMenu.mouseenter (function () {
			$(this).find (utilSub).show ();
			$(this).find (utilMenuTit).addClass ('on');
		}).focusin (function () {
			$(this).find (utilSub).show ();
			$(this).find (utilMenuTit).addClass ('on');
		});
		
		utilMenu.mouseleave (function () {
			utilSub.hide ();
			utilMenuTit.removeClass ('on');
		});
		
		$('h1 a').focusin (function () {
			utilSub.hide ();
			utilMenuTit.removeClass ('on');
		});
		
		// 이벤트배너
		jqueryPluginManager.setPlugin ('circularRolling', jqueryCircularRolling);
		var $eventBannerWrap = $el.find ('.header_event'),
			$eventBanner = $eventBannerWrap.find ('.event_wrap > ul' ).circularRolling ({
				nextBtn: $eventBannerWrap.find ('.btn_next > a'),
				prevBtn: $eventBannerWrap.find ('.btn_prev > a'),
				slidesSelector: '> li',
				moveWidth: 160,
				duration: 0
			});
		
		s.setSearch ();
	},
	
	setSearch: function () {
		//
	},

	render: function () {
		var s = this,
			data = {
				appCd: jspVariables.get ( 'appCd' ),
				mobileUrl: jspVariables.get ( 'mobileUrl' ),
				mobileSslUrl: jspVariables.get ( 'mobileSslUrl' ),
				joinCJMember: jspVariables.get ( 'joinCJMember' ),
				cacheMobileURl: jspVariables.get ( 'cacheMobileURl' ),
				ecUserUrl : jspVariables.get( 'ecUserUrl' ),
				ecOrderUrl : jspVariables.get( 'ecOrderUrl' ),
				ecProduceUrl : jspVariables.get( 'ecProductUrl' ),
				ecDisplayUrl : jspVariables.get( 'ecDisplayUrl' ),
				ecBenefitUrl : jspVariables.get( 'ecBenefitUrl' ),
				ecEventUrl : jspVariables.get( 'ecEventUrl' )
			};
	
		s.$el.html (s.template (data));
	}
});

module.exports = View;
