/**
 * 브라우저에서 특정기능을 사용할 수 있는지 여부를 체크하는 유틸
 *
 * @module common/cjos/util/canIUseUtil
 * 
 * @requires module:common/cjos/util/userAgentUtil
 */
// import
var userAgentUtil = require ('common/cjos/util/userAgentUtil');

// canIUseUtil


var prop = {};

//	vendor prefix check ( transition, transform )
function getVendorPropertyName (div, prop) {
	// Handle unprefixed versions (FF16+, for example)
	if (prop in div.style) {
		return prop;
	}

	var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
	var prop_ = prop.charAt (0).toUpperCase () + prop.substr (1);
	if (prop in div.style) {
		return prop;
	}
	for (var i = 0; i < prefixes.length; i++){
		var vendorProp = prefixes[i] + prop_;
		if (vendorProp in div.style) {
			return vendorProp; 
		}
	}
}

function has3d () {
	var el = document.createElement ('p'), 
		has3d,
		transforms = {
			'webkitTransform': '-webkit-transform',
			'OTransform': '-o-transform',
			'msTransform': '-ms-transform',
			'MozTransform': '-moz-transform',
			'transform': 'transform'
		};

	// Add it to the body to get the computed style.
	document.body.insertBefore (el, null);
	for (var t in transforms) {
		if (el.style [t] !== undefined) {
			el.style [t] = 'translate3d(1px,1px,1px)';
			has3d = window.getComputedStyle (el).getPropertyValue (transforms [t]);
		}
	}
	document.body.removeChild (el);
	prop.has3d = (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
	return prop.has3d;
}

function transformProp () {
	var div = document.createElement ('div'),
		transform = getVendorPropertyName (div, 'transform');
	div = null;
	prop.transformProp = transform;
	return prop.transformProp;
}

function transtionProp () {
	var div = document.createElement ('div'),
		transition = getVendorPropertyName (div, 'transition');
	div = null;
	prop.transtionProp = transition;
	return prop.transtionProp;
}

function transtionendName () {
	var	isWinSafari = userAgentUtil.getIsWinSafari (),
		prefixes = ['', 'moz', 'webkit', 'o', 'ms'],
		eventName = '';

	for (var i = 0; i < prefixes.length; i++) {
		var vendor = prefixes [i],
			event = 'on' + vendor + 'transitionend';
		
		if (event in window) {
			eventName = ((vendor) ? vendor + 'T' : 't') + 'ransition' + ((vendor && isWinSafari) ? 'End' : 'end');
			break;
		}
	}
	prop.transtionendName = eventName;
	return prop.transtionendName;
}

module.exports = {
	/**
	 * 브라우저 prefix
	 *
	 * @returns {Boolean}
	 */	
	getVendorPropertyName: getVendorPropertyName,

	/**
	 * 브라우저 3d transform 지원여부
	 *
	 * @returns {Boolean}
	 */	
	has3d: function () {
		if (typeof prop.has3d !== 'undefined') {
			return prop.has3d;
		}
		return has3d ();
	},

	/**
	 * 브라우저 3d transform property name
	 *
	 * @returns {Boolean}
	 */	
	transformProp: function () {
		if (typeof prop.transformProp !== 'undefined') {
			return prop.transformProp;
		}
		return transformProp ();
	},
	
	/**
	 * 브라우저 transition property name
	 *
	 * @returns {Boolean}
	 */	
	transtionProp: function () {
		if (typeof prop.transtionProp !== 'undefined') {
			return prop.transtionProp;
		}
		return transtionProp ();
	},
	
	/**
	 * 브라우저 transitionend event name
	 *
	 * @returns {Boolean}
	 */	
	transtionendName: function () {
		if (typeof prop.transtionendName !== 'undefined') {
			return prop.transtionendName;
		}
		return transtionendName ();
	}
};