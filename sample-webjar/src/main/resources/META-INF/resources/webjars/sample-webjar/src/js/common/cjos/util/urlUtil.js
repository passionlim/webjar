/**
 * URL관련 유틸
 *
 * @module common/cjos/util/urlUtil
 */

module.exports = {
	/**
	 * id=123445&catecory=javascript등과 같은 쿼리형문자열을 해시값으로 변환 -> {id:'23445', catecory: 'javascript'}
	 *
	 * @param {String} q 쿼리를 추출할 문자열( ex) id=123445&catecory=javascript )
	 * @param {Boolean} isTraditional 키값이 array를 나타내는 'arr[]'일때 키값을 arr로 변경여부 ( true: 변경, false: 변경하지 않음 )
	 * @returns {Object} 키:밸류의 오브젝트
	 */
	queryToHash: function (q, isTraditional) {
		// &, ? 로 시작될때 없앰
		if (/^&|^\?/.test (q)) {
			q = q.substring (1);
		}

		var result = {};
		var urlQuery = /(\w*)\=(https?:\/\/(\w*:\w*@)?[-\w.]+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/g;
		
		// query값에 URL형태의 정보가 있다면.
		if (urlQuery.test (q)) {
			q = q.replace (urlQuery, function (url, $key, $url) {
				result [$key] = $url;
				return '';
			});
		}
		
		var params = q.split ('&');
		var delimeter = '[^]';
		var reg = /(\+|%20|%26|%3F|%2F|%3A|%3B|%3D)/; // 인코딩된 특수기호판별 ( 공백1 공백2 & ? / : ; = )
		
		for (var i = 0; i < params.length; i++) {
			if (params [i].length === 0) {
				continue;
			}

			var param = params [i].replace (/\=/, delimeter);
			var	pair = param.split (delimeter);
			var	key = pair [0];
			var	value = pair [1];
			
			if (reg.test (value)) {
				value = value.replace (/\+|%20/g, ' ')
							.replace (/%26/g, '&' )
							.replace (/%3F/g, '?' )
							.replace (/%2F/g, '/' )
							.replace (/%3A/g, ':' )
							.replace (/%3B/g, ';' )
							.replace (/%3D/g, '=' );
			}
			
			key = decodeURIComponent (key);
			value = decodeURIComponent (value); 
			
			if (typeof result [key] === 'undefined') {
				// 키값의 끝이 [] 아닐때
				if (key.substr (key.length - 2) !== '[]') {
					result [key] = value;
				} else {
					result [key] = [value];
				}
			} else if (typeof result [key] === 'string') {
				result [key] = value; // replace it
			} else { //If subsequent entry with this name and is array
				result [key].push (value);
			}
		}
		
		if (isTraditional) {
			_.mapObject (result, function (val, key, obj) {
				if (/\[\]$/.test (key)) {
					var newKey = key.replace (/\[\]$/, '');
					obj [newKey] = val;
					delete obj [key];
				}
			});
		}
		
		return result;
	},
	
	/**
	 * object를 쿼리형문자열로 변환
	 *
	 * @param {Object} obj 변환할 object
	 * @returns {String}
	 */
	hashToQuery: function (obj) {
		var parts = [];
		for (var key in obj) {
			if (obj.hasOwnProperty (key)) {
				var part = encodeURIComponent (key) + '=' + encodeURIComponent (obj [key]);
				parts.push (part);
			}
		}
		return parts.join ('&');
	},
	
	/**
	 * URL형태의 문자열에서 도메인과 파라미터정보 가져오기
	 *
	 * @param {String} url
	 * @returns {Object} 키:값형태
	 */
	urlDataFromURLString: function (url) {
		var s = this;
		var urlReg = /(https?:\/\/(\w*:\w*@)?[-\w.]+(:\d+)?)?(\/([\w\/_\.]*(\?\S+)?)?)?/i;
		if (typeof url !== 'string' || !urlReg.test (url)) {
			return {path: '', params: {}, hash: ''};
		}

		var parts;
		var converted;
		var delimeter;
		var path;
		var params;
		var hash;

		converted = url.replace (/\?|#/, function (d) {
			delimeter = (d === '?') ? '[?]' : '[#]';
			return delimeter;
		});

		if (delimeter === '[?]') {
			parts = converted.match (/(.*)\[\?\](.*)/);
			path = parts [1];
			params = parts [2];
			if (params) {
				params = params.replace (/#.*$/, function ($hash) {
					hash = $hash.substring (1);
					return '';
				});
				params = s.queryToHash (params);
			} else {
				params = {};
				hash = '';
			}
		} else if (delimeter === '[#]') {
			parts = converted.match (/(.*)\[#\](.*)/);
			path = parts [1];
			params = {};
			hash = parts [2];
		} else {
			path = url;
			params = {};
			hash = '';
		}

		return {
			path: path,
			params: params,
			hash: hash
		};
	},
	
	/**
	 * 현재URL의 params를 hash로 변환
	 *
	 * @returns {Object} 키:값형태
	 */
	urlParamsToHash: function () {
		var s = this;
		var searchQuery = location.search.substring (1);
		var result = s.queryToHash (searchQuery, true);
		
		return result;
	},
	
	/**
	 * url문자열에 파라미터 값 가져오기
	 *
	 * @param {String} url URL문자열
	 * @param {String} key 키
	 * @returns {String} 파라미터 값
	 */
	getParamFromURLString: function (url, key) {
		var s = this;
		if (typeof url !== 'string' || !key) {
			return url;
		}
		
		var urlData = s.urlDataFromURLString (url);
		var params = urlData.params;
		
		return params [key];
	},
	
	/**
	 * url문자열에 파라미터추가
	 *
	 * @param {String} url URL문자열
	 * @param {String} key 키
	 * @param {String} value 값
	 * @param {Boolean} overwrite 덮어쓰기
	 * @returns {String} 파라미터가 추가된 문자열
	 */
	setParamToURLString: function (url, key, value, overwrite) {
		var s = this;
		if (typeof url !== 'string' || !key) {
			return url;
		}
		
		var urlData = s.urlDataFromURLString (url);
		var path = urlData.path;
		var params = urlData.params;
		var hash = urlData.hash;
		var resQuery;
		var resUrl;
		
		if (overwrite || typeof params [key] === 'undefined') {
			params [key] = value;
		}
		
		resQuery = s.hashToQuery (params);
		resUrl = path + (resQuery ? '?' + resQuery : '') + (hash ? '#' + hash : '');
		
		return resUrl;
	},
	
	/**
	 * url문자열에 파라미터 삭제
	 *
	 * @param {String} url URL문자열
	 * @param {String} key 키
	 * @returns {String} 파라미터가 삭제된 문자열
	 */
	removeParamFromURLString: function (url, key) {
		var s = this;
		if (typeof url !== 'string' || !key) {
			return url;
		}
		
		var urlData = s.urlDataFromURLString (url);
		var path = urlData.path;
		var params = urlData.params;
		var hash = urlData.hash;
		var resQuery;
		var resUrl;
		
		delete params [key];
		resQuery = s.hashToQuery (params);
		resUrl = path + (resQuery ? '?' + resQuery : '') + (hash ? '#' + hash : '');
		
		return resUrl;
	},
	
	/**
	 * url문자열에 파라미터들 추가
	 *
	 * @param {String} url URL문자열
	 * @param {Object} dic 키:값(String) 으로 이루어진 Hash맵
	 * @param {Boolean} overwrite 덮어쓰기
	 * @returns {String} 파라미터들이 추가된 문자열
	 */
	setParamsToURLString: function (url, dic, overwrite) {
		var s = this;
		if (typeof url !== 'string' || !dic) {
			return url;
		}
		
		var urlData = s.urlDataFromURLString (url);
		var path = urlData.path;
		var params = urlData.params;
		var hash = urlData.hash;
		var resQuery;
		var resUrl;
		
		for (var key in dic) {
			if (overwrite || typeof params [key] === 'undefined') {
				params [key] = dic [key];
			}
		}
		
		resQuery = s.hashToQuery (params);
		resUrl = path + (resQuery ? '?' + resQuery : '') + (hash ? '#' + hash : '');
		
		return resUrl;
	},
	
	/**
	 * url문자열에 파라미터들 삭제
	 *
	 * @param {String} url URL문자열
	 * @param {Array} keys 키값들
	 * @returns {String} 파라미터들이 삭제된 문자열
	 */
	removeParamsFromURLString: function ( url, keys ) {
		var s = this;
		if (typeof url !== 'string') {
			return url;
		}
		
		var reg = /\?|#/;
		var parts = url.split (reg);
		var path = parts [0];
		var query = parts [1];
		var hashTag = parts [2];
		var queryObj;
		var resQuery;
		var resUrl;
		
		if (typeof query === 'undefined') {
			return url;
		}
		
		queryObj = s.queryToHash (query);
		for (var i = 0, len = keys.length; i < len; i++) {
			delete queryObj [keys [i]];
		}
		
		resQuery = s.hashToQuery (queryObj);
		resUrl = path + (resQuery ? '?' + resQuery : '') + (hashTag ? '#' + hashTag : '');
		
		return resUrl;
	},
	
	/**
	 * Get hash property
	 *
	 * @param {String} key hash key
	 * @returns {String}
	 */
	getHashProperty: function (key) {
		var s = this;
		var hash = location.hash.substr (1);
		if (hash.length < 1) {
			return null;
		}
		
		var data = hash.split (',');
		var l = data.length;
		var tmp;
		var sepIdx = -1;
		var k;
		
		for (var i = 0; i < l; i++) {
			sepIdx = data [i].indexOf (':');
			if (sepIdx > -1) {
				k = data [i].substr (0, sepIdx);
				if (k === key) {
					return data [i].substr (sepIdx + 1);
				}
			}
		}
		return null;
	},

	/**
	 * Set hash property
	 *
	 * @param {String} key hash key
	 * @param {*} value
	 */
	setHashProperty: function (key, value) {
		var s = this;
		var hash = location.hash.substr (1);
	
		if (hash.length < 1) {
			hash = key + ':' + value;
			location.hash = hash;
			return true;
		}
	
		var data = hash.split (',');
		var i;
		var l = data.length;
		var tmp;
		var sepIdx = -1;
		var k;
		var v;
		var hasKey = false;
	
		for (i = 0; i < l; i++) {
			sepIdx = data [i].indexOf (':');
			if (sepIdx > -1) {
				k = data [i].substr (0, sepIdx);
				if (k === key) {
					if (hasKey) {
						data [i] = null;
					} else {
						hasKey = true;
						data [i] = [key, value];
					}
				} else {
					v = data [i].substr (sepIdx + 1);
					if (v.length < 1) {
						data [i] = null;
					} else {
						data [i] = [k, v];
					}
				}
			}
		}
	
		if (!hasKey) {
			data [i] = [key, value];
		}
	
		l = data.length;
		hash = '';
	
		for (i = 0; i < l; i++) {
			if (_.isString (data [i])) {
				hash += data [i];
			} else if (_.isArray (data [i]) && data [i].length > 1) {
				hash += data [i][0] + ':' + data [i][1] + ',';
			}
		}
		hash = hash.substr (0, hash.length - 1);
		
		location.hash = hash;
	},
	
	/**
	 * HTTP protocol from url
	 *
	 * @param {String} url URL문자열
	 * @returns {String}
	 */
	appendHTTPProtocolFromURLString: function (url) {
		if (url.indexOf ('http') === 0) {
			return url;
		}
		
		if (url.indexOf ('//') === 0) {
			return 'http:' + url;
		}
		return 'http://' + url;
	},

	/**
	 * Get protocol from URL
	 *
	 * @param {String} url URL문자열
	 * @returns {String}
	 */
	getProtocolFromURLString: function (url) {
		var i = url.indexOf ('://');
		if (i < 0) {
			return null;
		}
		return url.substr (0, i);
	}
};