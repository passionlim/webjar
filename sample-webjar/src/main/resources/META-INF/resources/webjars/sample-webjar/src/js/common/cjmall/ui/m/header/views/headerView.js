/**
 * CJmall 모바일 기본헤더뷰
 * 
 * @module common/cjmall/ui/m/header/views/headerView
 * 
 * @requires module:common/cjos/util/commonUtil
 * @requires module:common/cjos/util/userAgentUtil
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjmall/ui/m/header/templates/headerView.handlebars
 */
// import
var commonUtil	  = require ('common/cjos/util/commonUtil');
var userAgentUtil = require ('common/cjos/util/userAgentUtil');
var jspVariables  = require ('common/cjos/util/jspVariables');
var template	  = require ('common/cjmall/ui/m/header/templates/headerView.handlebars');

// view
var View = Backbone.View.extend ( {
	
	el: '#o1h_header_wrap',
	template: null,
	isExist: false,
	
	initialize: function ( tmplId ) {
		var s = this;
		if (userAgentUtil.getIsCjmallApp ()) {
			return;
		}
		s.template = template;
		s.render ();
	},
	
	getExist: function () {
		return this.isExist;
	},
	
	setFixed: function () {
		if (jindo.m.useFixed ()) {
			this.$el.css ({position: 'fixed', width: '100%', top: 0, zIndex: 501});
		}
	},
	
	render: function () {
		this.isExist = true;
		var s = this,
		data = {
			pageTitle: jspVariables.get ('pageTitle'),
		};
		
		s.$el.html (s.template (data));
		s.setFixed ();
	}
});

module.exports = commonUtil.getSingleton (View);