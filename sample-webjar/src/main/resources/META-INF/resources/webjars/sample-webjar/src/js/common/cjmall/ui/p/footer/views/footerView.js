var eventProxyManager	= require ('common/cjos/util/eventProxyManager');
var	eventProxyTypes		= require ('common/cjmall/util/p/eventProxyTypes');
var	template 			= require ('common/cjmall/ui/p/footer/templates/footerView.handlebars');


var View = Backbone.View.extend ( {

	el: '#cjm_footer',
	template: null,
	
	initialize: function () {
		var s = this;
		s.template = template;
		s.render ();
	},
	
	render: function () {
		var s = this;
		s.$el.html (s.template ());
		eventProxyManager.trigger (eventProxyTypes.RENDERED_FOOTER);
	}
} );

module.exports = View;
