/**
 * CJmall 모바일 좌측메뉴의 최근본상품컬렉션
 * 
 * @module common/cjmall/ui/m/left/collections/recentItemCollection
 * 
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjos/util/urlUtil
 * @requires module:common/cjmall/util/m/jsConstants
 * @requires module:common/cjmall/util/m/recentItems
 * @requires module:common/cjmall/util/m/cjmallMobileUtil
 * @requires module:common/cjmall/ui/m/left/models/recentItemModel
 */
// import
var jspVariables    = require ('common/cjos/util/jspVariables');
var urlUtil			= require ('common/cjos/util/urlUtil');
var cjmallJsContants= require ('common/cjmall/util/m/jsConstants');
var recentItems     = require ('common/cjmall/util/m/recentItems');
var cjmallMUtil		= require ('common/cjmall/util/m/cjmallMobileUtil');
var RecentItemModel = require ('common/cjmall/ui/m/left/models/recentItemModel');

// recentItemCollection

var Collection = Backbone.Collection.extend ({

	model: RecentItemModel,
	mobileUrl: '',
	defaultAndParam: null,
	
	initialize: function () {
		var s = this;
		s.mobileUrl = jspVariables.get ('mobileUrl');
		s.defaultAndParam = jspVariables.get ('defaultAndParam');
		recentItems.subcribe (s, s.changeHn);
	},
	
	changeHn: function ( msg ) {
		var s = this;
		switch ( msg ) {
			case 'init':
			case 'update':
			case 'remove':
			case 'removeAll':
				s.update ();
				break;
		}
	},
	
	update: function () {
		var s = this;
		var	mobileUrl = s.mobileUrl;
		var	paramObj = (s.defaultAndParam) ? urlUtil.queryToHash (s.defaultAndParam) : {};
		var	items = recentItems.gets ();
		var	arr = [];
		
		s.reset ();
		if (items.length) {
			_.each (items, function (item, index) {
			    var itemCode =    item.itemCode;
				var	channelCode = item.channelCode;
				var	moCode =      item.moCode;
				var	moCodeImg =   item.moCodeImg;
				var	harmGrd =     item.harmGrd;
				var	itemImgUrl = cjmallMUtil.getImgUrl (itemCode, moCodeImg);
				var	linkUrl = cjmallMUtil.getLinkUrl (itemCode, channelCode, moCode);
				var	picCode = (moCode ? moCode : itemCode);
				var	model = new RecentItemModel ({
						itemCode: itemCode,
						channelCode: channelCode,
						itemImgUrl: cjmallMUtil.getHarmGrd (harmGrd) ? itemImgUrl : cjmallJsContants.IMG_URL.SEARCH+'harm_grade_K.jpg',
						linkUrl: urlUtil.setParamsToURLString (mobileUrl + linkUrl, paramObj),
						pic: 'viewed_' + picCode,
						picImg: 'viewed_' + picCode + '_img',
						spcid: 'viewed_' + picCode + '_del'
					});
			
				arr.push (model);
			} );
		} else {
			s.trigger ('update');
		}
		s.add (arr);
	}
});

module.exports = Collection;