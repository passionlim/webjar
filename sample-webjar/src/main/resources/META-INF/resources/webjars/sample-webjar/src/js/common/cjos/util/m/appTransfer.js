/**
 * app 마켓연결 유틸
 * 
 * @module common/cjos/util/m/appTransfer
 * 
 * @requires module:common/cjos/util/userAgentUtil
 * @requires module:common/cjos/util/urlUtil
 */
// import
var userAgentUtil = require ('common/cjos/util/userAgentUtil');
var urlUtil		  = require ('common/cjos/util/urlUtil');


// appTransfer

var os = userAgentUtil.getOs ();
var eventsName = ['pagehide', 'blur'];
var appInfo = {
	'cjmall': {
		'marketURL': {
			'android': 'market://details?id=com.cjoshppingphone',
			'ios': 'https://itunes.apple.com/kr/app/cjmall/id366509410?mt=8'
		},
		'schemaURL': 'cjmallapp://web|http://mw.cjmall.com/m/main.jsp?app_cd=',
		'app_cd' : {
			'android': 'GXSP',
			'ios': 'APP'
		}
	},
	'oclock': {
		'marketURL': {
			'android': 'market://details?id=com.cjoclock',
			'ios' : 'http://itunes.apple.com/kr/app/okeullag-cjmallsosyeolkeomeoseu/id549395569?mt=8'
		},
		'schemaURL': 'oclockapp://hometop'
	},
	'oliveyoung': {
		'marketURL': {
			'android': 'market://details?id=com.oliveyoung',
			'ios': 'https://itunes.apple.com/kr/app/cjollibeuyeong/id873779010?mt=8'
		},
		'schemaURL': 'oliveyoungapp://mw.oliveyoungshop.com/m/main.jsp'
	}
};

var cjapp = {
	run: function (appName, schemaURL, appInfoObj) {
		if (typeof appInfoObj !== 'undefined') {
			$.extend (appInfo, appInfoObj);
		}
		var app = appInfo [appName];

		if (!app) {
			return { 
				transfer: function () {
					alert ('운영하지 않는 앱입니다.');
				}
			};
		}
		
		return {
			transfer: function () {
				var moveMarket = (function (os) {
					return function () {
						var marketURL = app.marketURL [os];
						var _schemaURL = app.schemaURL;
						if (os === "ios") {
							var osVer = urlUtil.getIosVer ();
							if (osVer < '9' && osVer >= '8'){
								createAnchorClinkEvent (marketURL);
							}else{
								location.href = marketURL;
							}
						} else {
							if (typeof schemaURL !== 'undefined') {
								marketURL = marketURL + '&url=' + schemaURL;
							}
							location.href = marketURL;
						}
					};
				}) (os);
				
				var default_url = app.schemaURL;
				if (appName === 'cjmall') {
					default_url = default_url + app.app_cd [os];
				}
				
				if (os === 'ios') {
					var urlParams = urlUtil.urlParamsToHash ();
					var osVer = urlUtil.getIosVer ();
					var targetUrl = '';
					
					if (urlParams.app_cd !== 'APP') {
						var timer = setTimeout (moveMarket, 3 * 1000);
						
						$.each (eventsName , function (key, eventName) {
							window.addEventListener (eventName, clearTimer (timer));
						});
						
						if (typeof schemaURL !== 'undefined') {
							targetUrl = schemaURL;
						}else{
							targetUrl = default_url;
						}
					} else {
						targetUrl = schemaURL;
					}
					
					// ios 8버전인지
					if (osVer < '9' && osVer >= '8') {
						createAnchorClinkEvent (targetUrl);
					}else{
						location.href = targetUrl;
					}
				} else if (os === 'android') {
					if (typeof schemaURL !== 'undefined') {
						location.href = app.marketURL [os] + '&url=' + encodeURIComponent (schemaURL);
					}else{
						location.href = app.marketURL [os] + '&url=' + default_url;
					}
				}

				function createAnchorClinkEvent (linkURL) {
					var a = document.createElement ('a');
					a.setAttribute ('href', linkURL);
					var d = document.createEvent ('HTMLEvents');
					d.initEvent ('click', true, true);
					a.dispatchEvent (d);
				}

				function clearTimer (timer) {
					return function () {
						clearTimeout (timer);
						$.each (eventsName , function (key, eventName) {
							window.removeEventListener (eventName, arguments.callee);
						});
					};
				}
			}// /transfer
		};
	}, // run
	
	appTransfer: function (appName, schemaURL) {
		this.run (appName, schemaURL).transfer ();
	}
};

module.exports = cjapp;