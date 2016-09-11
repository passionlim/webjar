/**
 * CJmall 모바일 푸터, 하단바
 * 
 * @module common/cjmall/ui/m/footer/views/footerView
 * 
 * @requires module:common/cjos/util/commonUtil
 * @requires module:common/cjos/util/userAgentUtil
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjos/util/eventProxyManager
 * @requires module:common/cjmall/util/m/eventProxyTypes
 * @requires module:common/cjmall/util/m/jsConstants
 * @requires module:common/cjmall/util/m/cjmallMobileUtil
 * @requires module:common/cjmall/ui/m/footer/templates/footerView.handlebars
 */
// import
var commonUtil	  			= require ('common/cjos/util/commonUtil');
var userAgentUtil 			= require ('common/cjos/util/userAgentUtil');
var jspVariables  			= require ('common/cjos/util/jspVariables');
var eventProxyManager		= require ('common/cjos/util/eventProxyManager');
var cjmallMEventProxyTypes	= require ('common/cjmall/util/m/eventProxyTypes');
var cjmallJsContants		= require ('common/cjmall/util/m/jsConstants');
var cjmallMobileUtil		= require ('common/cjmall/util/m/cjmallMobileUtil');
var template				= require ('common/cjmall/ui/m/footer/templates/footerView.handlebars');

// view
var View = Backbone.View.extend ( {
	
	el: '#o1h_footer',
	template: null,
	
	events: {
		'click .n_btm_bar > ul > li:nth-child(2)' :'clickCate',
		'click .footer_bottomArea a.pcVer': 'pcVersionHn'
	},
	
	initialize: function () {
		var s = this;
		if (userAgentUtil.getIsCjmallApp ()) {
			return;
		}
		
		s.template = template;
		s.render ();
	},
	show: function () {
		this.$el.show ();
	},
	
	hide: function () {
		this.$el.hide ();
	},
	
	clickCate:function (e) {
		e.preventDefault ();
		eventProxyManager.trigger (cjmallMEventProxyTypes.CLICK_CATEGORY);
	},
	
	pcVersionHn: function (e) {
		e.preventDefault ();
		var $curTarget = $ (e.currentTarget);
		var	href = $curTarget.attr ('href');
		
		cjmallMobileUtil.pcVersion (href, 'PC버전');
	},
	
	render: function () {
		var s = this;
		var	jsGlobal = cjmallJsContants.GLOBAL;
		var	data = {
				isLogin: jsGlobal.IS_LOGIN,
				appCd: jspVariables.get ('appCd'),
				mobileUrl: jspVariables.get ('mobileUrl'),
				mobileSslUrl: jspVariables.get ('mobileSslUrl'),
				joinCJMember: jspVariables.get ('joinCJMember'),
				cacheMobileURl: jspVariables.get ('cacheMobileURl')
			};
		
		s.$el.html (s.template (data));
		
		if (!jindo.m.useFixed ()) {
			var $wnd = $ (window);
			var	$doc = $ (document);
			var	$bottomBar = s.$el.find ('.bottom_bar');
			var	bottomH = $bottomBar.outerHeight ();
			var	st = $doc.scrollTop ();
			var	clientH = $wnd.height ();
			var	targetTop = st + clientH - bottomH;
			
			$bottomBar.css ({position: 'absolute', top: targetTop});
			$wnd.on ('scroll', function () {
				st = $doc.scrollTop ();
				clientH = $wnd.height ();
				targetTop = st + clientH - bottomH;
				$bottomBar.css ({top: targetTop});
			});
		}
	}
});

module.exports = commonUtil.getSingleton (View);