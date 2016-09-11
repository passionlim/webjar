var CircularRollingBasicItem = function (options) {
	var $that = this,
		opts = $.extend ({}, CircularRollingBasicItem.defaults, options);
	
	// 멤버변수 설정
	$that.opts = opts;
	$.extend ($that, CircularRollingBasicItem.method);
	$that.timer = null;
	// 초기화
	$that.init ();
	return $that;
};
CircularRollingBasicItem.defaults = {
	index: 0,
	isPreventDefault: false,
	selectEventType: 'click'
};
CircularRollingBasicItem.method = {
	init: function () {
		var $that = this,
			opts = $that.opts,
			isPreventDefault = opts.isPreventDefault;

		if (opts.selectEventType === 'mouseenter') {
			$that.on ('mouseover', {$currentTarget: $that}, $that.overHn);
			$that.on ('mouseout', {$currentTarget: $that}, $that.outHn);
		}

		if (opts.selectEventType === 'click') {
			$that.on ('click', {$currentTarget: $that}, $that.clickHn);
		}
	},
	getIndex: function () {
		return this.opts.index;
	},
	triggerSelect: function () {
		var	$that = this,
			event = $.Event ('select');
		
		event.$currentTarget = $that;
		event.index = $that.opts.index;
		$that.trigger (event);	
	},
	clickHn: function (e) {
		var $currentTarget = e.data.$currentTarget,
			opts = $currentTarget.opts,
			isPreventDefault = opts.isPreventDefault;

		if (isPreventDefault) {
			e.preventDefault ();
		}
		$currentTarget.triggerSelect ();
	},
	/*overHn: function ( e ) {
		var $currentTarget = e.data.$currentTarget;
		$currentTarget.triggerSelect ();
	},*/
	overHn: function (e) {
		var $currentTarget = e.data.$currentTarget;
		if ($currentTarget.timer) {
			clearTimeout ($currentTarget.timer);
			$currentTarget.timer = null;
		}
		$currentTarget.timer = setTimeout (_.bind ($currentTarget.triggerSelect, $currentTarget), 100);
	},
	outHn: function (e) {
		var $currentTarget = e.data.$currentTarget; 
		if ($currentTarget.timer) {
			clearTimeout ($currentTarget.timer);
			$currentTarget.timer = null;
		}
	},
	triggerEnter: function (e) {
		this.triggerSelect (e.data.$currentTarget);
	}
};

module.exports = CircularRollingBasicItem;