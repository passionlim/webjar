/**
 * CJmall 모바일 좌측메뉴의 카테고리뷰
 * 
 * @module common/cjmall/ui/m/left/views/leftCategoryView
 * 
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjmall/ui/m/left/collections/categoryCollection
 * @requires module:common/cjmall/ui/m/left/templates/leftCategoryView.handlebars
 */
// import
var jspVariables		= require ('common/cjos/util/jspVariables');
var CategoryCollection	= require ('common/cjmall/ui/m/left/collections/categoryCollection');
var template			= require ('common/cjmall/ui/m/left/templates/leftCategoryView.handlebars');


// leftCategoryView

var View = Backbone.View.extend ( {
	
	el: '#o1h_left ul.depth1_ctg',
	template: null,
	collection: null,

	initialize: function () {
		var s = this;
		var	collection = new CategoryCollection ();
		
		s.collection = collection;
		s.template = template;
		s.listenTo (collection, 'update', s.render);
		collection.update ();
	},
	
	getCollection: function () {
		return this.collection;
	},
	
	render: function () {
		var s = this;
		var	data = { 
				mobileUrl: jspVariables.get ('mobileUrl'),
				appCd: jspVariables.get ('appCd'),
				categories: s.collection.toJSON ()
			};

		s.$el.html (s.template (data));
	}
});

module.exports = View;
