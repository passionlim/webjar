/**
 * CJmall 모바일 검색헤더뷰
 * 
 * @module common/cjmall/ui/m/header/views/searchHeaderView
 * 
 * @requires module:common/cjos/util/commonUtil
 * @requires module:common/cjos/util/userAgentUtil
 * @requires module:common/cjos/util/validateUtil
 * @requires module:common/cjmall/ui/m/header/templates/searchHeaderView.handlebars
 */
// import
var commonUtil	  = require ('common/cjos/util/commonUtil');
var userAgentUtil = require ('common/cjos/util/userAgentUtil');
var validateUtil  = require ('common/cjos/util/validateUtil');
var template	  = require ('common/cjmall/ui/m/header/templates/searchHeaderView.handlebars');

// view
var View = Backbone.View.extend ({
	
	el: '#o1h_header_wrap',
	template: null,
	placeholder: '검색어 입력',
	term: '',
	defaultValue: '',
	events: {
		//'keyup #srch_value': 'keyupHn',
		'input #srch_value': 'keyupHn',
		'change #srch_value': 'changeHn',
		'focusin #srch_value': 'focusinHn',
		'focusout #srch_value': 'focusoutHn',
		'click .search_close': 'searchCloseHn',
		'click .search_search': 'searchClickHn',
		'click .search_cancel': 'searchCancelHn',
		'submit form#submitFrm': 'submitHn'
	},
	
	initialize: function () {
		var s = this;
		if (userAgentUtil.getIsCjmallApp ()) {
			return;
		}
		
		s.template = template;
		s.render ();
		
		var $input = s.$el.find ('#srch_value');
		var $close = s.$el.find ('.search_close');
		
		s.term = $input.val ();
		s.$input = $input;
		s.$close = $close;
		s.setFixed ();
	},
	
	setValue: function (val) {
		var s = this;
		
		s.defaultValue = val;
		s.$input.val (val);
		s.$close.show ();
		
		if (userAgentUtil.getOs () === 'ios') {
			$(window).on ('popstate', function () {
				setTimeout (function () {
					s.$input.val (s.defaultValue);
					s.$input.blur ();
				}, 1);
			});
		}
	},
	
	submit: function () {
		var s = this;
		var	val = s.$input.val ();
		var	checkXSS = validateUtil.checkXSS (val);
		
		if (!checkXSS) {
			alert ( '특수기호는 문장은 사용하실수 없습니다' );
			s.$input.val ('');
			return;
		}
		
		if (val.length === 0 || val.trim () === '') {
			alert ('검색어를  입력해주세요');
			return;
		}
		s.trigger ('submit', val);
	},
	
	triggerUpdate: function () {
		var s = this;
		var	val = s.$input.val ();
		
		if (val.length === 0) {
			s.close ();
		} else if (s.term !== val) {
			s.term = val;
			s.trigger ('update', val);
		}
	},
	
	close: function () {
		var s = this;
		s.$input.val ('');
		s.$input.focus ();
		s.term = '';
		s.$close.hide ();
		s.trigger ('close');
	},
	
	keyupHn: function (e) {
		var s = this;
		var	$input = s.$input;
		var	$close = s.$close;
		var	val = $input.val ();
		
		if (val) {
			$close.show ();
		} else {
			$close.hide ();
		}
			
		s.triggerUpdate ();
	},
	
	changeHn: function (e) {
		this.triggerUpdate ();
	},
	
	focusinHn: function (e) {
		var s = this;
		var	$input = s.$input;
		var	val = $input.val ();
		
		$input.attr ('placeholder', '');
		s.trigger ('focusin', val);
	},
	
	focusoutHn: function (e) {
		var s = this;
		var	$input = s.$input;
		
		$input.attr ('placeholder', s.placeholder);
		s.trigger ('focusout');
	},
	
	searchCloseHn: function (e) {
		e.preventDefault ();
		this.close ();
	},
	
	searchClickHn: function (e) {
		e.preventDefault ();
		this.submit ();
	},
	
	searchCancelHn: function (e) {
		e.preventDefault ();
		var s = this;
		var	$input = s.$input;
		var	$close = s.$close;
					
		if (s.defaultValue) {
			$input.val (s.defaultValue);
			$close.show ();
		}
		s.trigger ('cancel');
	},
	
	submitHn: function (e) {
		e.preventDefault ();
		this.submit ();
	},
	
	getExist: function () {
		return this.isExist;
	},
	
	setFixed: function () {
		var s = this;
		var $el = s.$el;
		
		if (jindo.m.useFixed ()) {
			$el.css ({position: 'fixed', width: '100%', top: 0, zIndex: 501});
		} else {
			var $wnd = $ ( window );
			var	$doc = $ ( document );
			var	st = $doc.scrollTop ();
			
			$el.css ({position: 'absolute', width: '100%', top: st, zIndex: 501});
			$wnd.on ('scroll', function () {
				st = $doc.scrollTop ();
				$el.css ({top: st});
			});
		}
	},
	
	render: function () {
		var s = this;
		s.$el.html (s.template ());
		s.isExist = true;
	}
});

module.exports = commonUtil.getSingleton (View);