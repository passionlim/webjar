/**
 * CJmall 모바일 좌측메뉴의 최근본상품뷰
 * 
 * @module common/cjmall/ui/m/left/views/leftRecentView
 * 
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjmall/ui/m/left/collections/recentItemCollection
 * @requires module:common/cjmall/ui/m/left/templates/leftRecentView.handlebars
 */
// import
var jspVariables		 = require ('common/cjos/util/jspVariables');
var RecentItemCollection = require ('common/cjmall/ui/m/left/collections/recentItemCollection');
var template			 = require ('common/cjmall/ui/m/left/templates/leftRecentView.handlebars');

// leftRecentView

var View = Backbone.View.extend ( {
	
	el: '#o1h_left .n_left_recent > ul',
	template: null,
	
	initialize: function () {
		var s = this,
			collection = new RecentItemCollection ();
		
		s.template = template;
		s.collection = collection;
		s.listenTo (collection, 'update', s.render);
	},
	
	render: function () {
		var s = this;
		var	$el = s.$el;
		var	items = s.collection.toJSON ();
		var	noImageUrl = jspVariables.get ('noImageUrl');
		var	data = {};
		
		if (items.length) {
			data.items = items.slice (0, 3);
			$el.html (s.template (data));
			$el.find ('> li > a > img').on ('error', function (e) {
				var $img = $ (e.currentTarget);
				$img.attr ('src', noImageUrl);
			} );
		} else {
			$el.html ('<li class="emtpy"><span>최근 본 상품이 없습니다</span></li>');
		}
	}
});

module.exports = View;
