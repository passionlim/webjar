/**
 * CJmall 모바일에서 사용되는 화면전체 딤드처리 UI
 *
 * @module common/cjmall/ui/m/dimmed/views/dimmedView
 */

// view
var View = Backbone.View.extend ({
	
	tagName: 'div',
	
	moveRange: 50,
	pos: {startX: 0, startY: 0},
	hasMoved: false,

	touchHnBind: null,
	oTransition: null,
	
	initialize: function () {
		var s = this;
		
		s.touchHnBind = _.bind (s.touchHn, s);
		s.oTransition = (jindo.m.useCss3d ()) ? new jindo.m.Transition () : null;
		s.render ();
	},
	
	show: function (duration) {
		var s = this;
		var $el = s.$el;
		
		$el.on ('touchstart touchmove touchend touchcancel', s.touchHnBind);
		if (s.oTransition) {
			s.oTransition.queue ($el.get (0), duration, {
				htStyle: {'display': 'block', 'opacity': '1'},
			}).start ();
		} else {
			$el.fadeIn (duration);
		}
	},

	hide: function (duration) {
		var s = this;
		var $el = s.$el;
		
		$el.off ('touchstart touchmove touchend touchcancel', s.touchHnBind);
		if (s.oTransition) {
			$el.display = 'block';
			s.oTransition.queue ($el.get (0), duration, {
				htStyle: {'display': 'block', 'opacity': '0'},
				fCallback: function () {
					$el.css ('display', 'none');
				}
			}).start ();
		} else {
			$el.fadeOut (duration);
		}
	},
	
	touchHn: function (e) {
		var s = this;
		var pos = s.pos;
		var moveRange = s.moveRange;
		
		switch (e.type) {
			case 'touchstart':
				pos.startX = e.originalEvent.touches [0].pageX;
				pos.startY = e.originalEvent.touches [0].pageY;
				s.hasMoved = false;
				break;
			case 'touchmove':
				e.preventDefault ();
				if (Math.abs (e.originalEvent.touches [0].pageX - pos.startX) > moveRange || Math.abs (e.originalEvent.touches [0].pageX - pos.startY) > moveRange) {
					s.hasMoved = true;
				}
				break;
			case 'touchend':
			case 'touchcancel':
				if (!s.hasMoved) {
					s.$el.trigger ('click');
				}
				s.hasMoved = false;
				break;
		}
	},

	render: function () {
		var s = this;
		var $el = s.$el;
		
		$el.css ({
			display: 'none',
			opaticy: 0,
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(0, 0, 0, 0.6)',
			zIndex: 1005,
			transform: 'translate3d(0px,0px,0px)',
			webkitTransform: 'translate3d(0px,0px,0px)'
		});
	}
});

module.exports = View;