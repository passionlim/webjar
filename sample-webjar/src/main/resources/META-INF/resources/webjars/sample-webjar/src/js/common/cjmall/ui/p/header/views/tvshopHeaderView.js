var util 	 = require ('common/cjos/util/util'),
	template = require ('common/cjmall/ui/p/header/templates/tvshopHeaderView.handlebars');


var View = Backbone.View.extend ( {

    el: '#tvshop_wrap',
    template: null,

    initialize: function () {
        var s = this;
        s.template = template;
        s.render ();
    },

    render: function () {
    	var s = this;
        s.$el.html ( s.template () );
    }
} );

module.exports = View;



