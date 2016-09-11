/**
 * CJmall 모바일 > 메인 헤더컬렉션
 * 
 * @module common/cjmall/ui/m/header/collections/mainHeaderCollection
 * 
 * @requires module:common/cjos/util/commonUtil
 * @requires module:common/cjos/util/urlUtil
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjmall/ui/m/header/models/mainHeaderModel
 */
//import
var commonUtil		= require ('common/cjos/util/commonUtil');
var urlUtil 		= require ('common/cjos/util/urlUtil');
var jspVariables 	= require ('common/cjos/util/jspVariables');
var MainHeaderModel = require ('common/cjmall/ui/m/header/models/mainHeaderModel');

//collection
var Collection = Backbone.Collection.extend ({

	model: MainHeaderModel,
	url: '',
	defaultAndParam: jspVariables.get ('defaultAndParam'),
	
	menuCode: '02', // 현재페이지의 메뉴코드
	ctgId: '', // 현재페이지가 테마샵일경우 ctg_id값
	
	initialize: function () {
		var s = this;
		s.menuCode = jspVariables.get ('menuCode');
		s.url =  jspVariables.get ('cacheMobileURl') + '/api/main/gnb.json';
		s.ctgId = urlUtil.getParamFromURLString (location.href, 'ctg_id');
	},
	
	validate: function (data) {
		if (!data || data.code === 0) {
			return false;
		}
		
		if (!data.result || !data.result.menuList) {
			return false;
		}
	
		return true;
	},
	
	update: function () {
		var s = this;
		if (s.ajax) {
			s.ajax.abort ();
		}
		s.reset ();
		s.ajax = Backbone.ajax ({
			url: s.url,
			success: function (data) {
				if (s.validate (data)) {
					var menuCode = s.menuCode;
					var	ctgId = s.ctgId;
					var	paramObj = (s.defaultAndParam) ? urlUtil.queryToHash (s.defaultAndParam) : {};
					var	menuList = data.result.menuList;
					var	modelArr = [];
					
					for (var i = 0, len = menuList.length; i < len; i++) {
						var menu = menuList [i];
						var	title = menu.title;
						var	flag = menu.flag;
						var	linkURL = menu.linkURL;
						var	code = menu.code;
						var	type = menu.type;
						var	menuCtgId = menu.ctgId;
						var	isOn = false;
						var	model;
						
						if (type === 'home') {
							isOn = (code === menuCode);
						} else {
							isOn = (code === menuCode && ctgId && ctgId === menuCtgId);
						}
						
						linkURL = (linkURL) ? urlUtil.setParamsToURLString (linkURL, paramObj) : '';
						
						model = new MainHeaderModel ({
							index: i,
							title: title,
							flag: flag,
							linkURL: linkURL,
							code: code,
							type: type,
							isOn: isOn
						});
						modelArr.push (model);
					}
					s.add (modelArr);
				} else {
					s.trigger ('fail');
				}
			},
			fail: function () {
				s.trigger ('fail');
			}
		});
	}
});

module.exports = commonUtil.getSingleton (Collection);