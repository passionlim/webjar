/**
 * 공통 유틸함수 모음
 * 1. 함수형태가 아닌 jQuery를 확장하는 플러그인은 추가금지!
 *
 * @module common/cjos/mobile/util/util
 */

/**
 * value값을 통화형태표현 ( 세 자릿수마다 콤마(,) 붙이기 )
 *
 * @param {number} value - 변환할 값
 * @returns {string} 해당포맷으로 변환된 문자열
 */
function formatNumber ( value ) {
	var number = unformat ( value );
	if ( _.isUndefined ( number ) ) {
		return value;
	}

	var	nagative = ( number < 0 ) ? '-' : '',
	//split = ( '' + Math.abs ( number ) ).split ( '.' ),
	//natural = split [ 0 ],
		natural = parseInt ( Math.abs ( number ) ).toString (),
		start = ( natural.length > 3 ) ? natural.length % 3 : 0,
		decimal = ( '' + value ).split ( '.' ) [ 1 ],
		result = nagative + ( ( start !== 0 ) ? natural.substr ( 0, start ) + ',' : '' ) + natural.substr ( start ).replace ( /(\d{3})(?=\d)/g, '$1,' ) + ( decimal ? '.' + decimal : '' );
	return result;
}

/**
 * 숫자로 변환. 변환가능한 타입이 아닐때에는 undefined 반환
 *
 * @param {number} value - 변환할 값
 * @returns {number} 변환된 숫자
 */
function unformat ( value ) {
	if ( typeof value === 'number' ) {
		return value;
	} else if ( typeof value === 'string' && value !== '') {
		if ( /[^0-9-.,]/g.test ( value ) ) {
			return undefined;
		} else {
			return parseFloat ( value.replace ( /[^0-9-.]/g, '' ) );
		}
	}
	return undefined;
}

/**
 * id=123445&catecory=javascript등과 같은 쿼리형문자열을 해시값으로 변환
 *
 * @param {string}  q - 쿼리를 추출할 문자열( ex) id=123445&catecory=javascript )
 * @param {boolean} isTraditional - 키값이 array를 나타내는 'arr[]'일때 키값을 arr로 변경여부 ( true: 변경, false: 변경하지 않음 )
 * @returns {object} 키:값형태
 */
function queryToHash ( q, isTraditional ) {
	// &, ? 로 시작될때 없앰
	if ( /^&|^\?/.test ( q ) ) {
		q = q.substring ( 1 );
	}
	
	var result = {},
		urlQuery = /(\w*)\=(https?:\/\/(\w*:\w*@)?[-\w.]+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/g;
	
	// query값에 URL형태의 정보가 있다면.
	if ( urlQuery.test ( q ) ) {
		q = q.replace ( urlQuery, function ( url, $key, $url ) {
			result [ $key ] = $url;
			return '';
		} );
	}
	
	var params = q.split ( '&' ),
		delimeter = '[^]',
		reg = /(\+|%20|%26|%3F|%2F|%3A|%3B|%3D)/; // 인코딩된 특수기호판별 ( 공백1 공백2 & ? / : ; = )
	
	for ( var i = 0; i < params.length; i++ ) {
		if ( params [ i ].length === 0 ) {
			continue;
		}
	
		var param = params [ i ].replace ( /\=/, delimeter ),
			pair = param.split ( delimeter ),
			key = pair [ 0 ],
			value = pair [ 1 ];
	
		if ( reg.test ( value ) ) {
			value = value.replace ( /\+|%20/g, ' ' ).
			replace ( /%26/g, '&' ).
			replace ( /%3F/g, '?' ).
			replace ( /%2F/g, '/' ).
			replace ( /%3A/g, ':' ).
			replace ( /%3B/g, ';' ).
			replace ( /%3D/g, '=' );
		}
	
		key = decodeURIComponent ( key );
		value = decodeURIComponent ( value );
		
		if ( typeof result [ key ] === 'undefined' ) {
			// 키값의 끝이 [] 아닐때
			if ( key.substr ( key.length - 2 ) !== '[]' ) {
				result [ key ] = value;
			} else {
				result [ key ] = [ value ];
			}
		} else if ( typeof result [ key ] === 'string' ) {
			result [ key ] = value; // replace it
		} else { //If subsequent entry with this name and is array
			result [ key ].push ( value );
		}
	}
	
	if ( isTraditional ) {
		_.mapObject ( result, function ( val, key, obj ) {
			if ( /\[\]$/.test ( key ) ) {
				var newKey = key.replace ( /\[\]$/, '' );
				obj [ newKey ] = val;
				delete obj [ key ];
			}
		} );
	}

	return result;
}

/**
 * object를 쿼리형문자열로 변환
 *
 * @param {object} obj - 변환할 object
 * @returns {string}
 */
function hashToQuery ( obj ) {
	var parts = [];
	for ( var key in obj ) {
		if ( obj.hasOwnProperty ( key ) ) {
			var part = encodeURIComponent ( key ) + '=' + encodeURIComponent ( obj [ key ] );
			parts.push ( part );
		}
	}
	return parts.join ( '&' );
}

/**
 * URL형태의 문자열에서 도메인과 파라미터정보 가져오기
 *
 * @param {string} url
 * @returns {object} 키:값형태
 */
function urlDataFromURLString ( url ) {
    var urlReg = /(https?:\/\/(\w*:\w*@)?[-\w.]+(:\d+)?)?(\/([\w\/_\.]*(\?\S+)?)?)?/i;
    if ( typeof url !== 'string' || !urlReg.test ( url ) ) {
        return { path: '', params: {}, hash: '' };
    }

    var parts,
        converted,
        delimeter,
        path,
        params,
        hash;

    converted = url.replace ( /\?|#/, function ( d ) {
        delimeter = ( d === '?' ) ? '[?]' : '[#]';
        return delimeter;
    } );

    if ( delimeter === '[?]' ) {
        parts = converted.match ( /(.*)\[\?\](.*)/ );
        path = parts [ 1 ];
        params = parts [ 2 ];
        if ( params ) {
            params = params.replace ( /#.*$/, function ( $hash ) {
                hash = $hash.substring ( 1 );
                return '';
            } );
            params = queryToHash ( params );
        } else {
            params = {};
            hash = '';
        }

    } else if ( delimeter === '[#]' ) {
        parts = converted.match ( /(.*)\[#\](.*)/ );
        path = parts [ 1 ];
        params = {};
        hash = parts [ 2 ];
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
}

module.exports = {
    formatNumber: formatNumber,
    unformat: unformat,
    queryToHash: queryToHash,
    hashToQuery: hashToQuery,
    urlDataFromURLString: urlDataFromURLString,

    /**
     * 싱글톤패턴으로 인스턴스를 생성할 수 있게 파라미터의 생성자함수를 랩핑하여 리턴함
     *
     * @param {function} constructor - 클래스(생성자함수)
     * @param {boolean} isMultipleArgs - 생성매개변수가 2개이상인지 여부 (주의) - Backbone.View는 2개이상의 매개변수가 지정될시 특정단말기에서 제대로 작동되지 않는다.
     * @returns {function} new 지시나, .getInstance 메서드를 써도 항상 동일한 인스턴스 반환
     */
    getSingleton: function ( constructor, isMultipleArgs ) {
        var Singleton = function () {
            return Singleton.getInstance.apply ( this, arguments );
        };
        Singleton.__instance__ = null;
        Singleton.getInstance = function () {
            if ( !Singleton.__instance__ ) {
                var factory = ( isMultipleArgs ) ? Function.prototype.bind.apply ( constructor, [ null ].concat ( _.toArray ( arguments ) ) ) :
                    _.bind ( constructor, null, arguments [ 0 ] );
                Singleton.__instance__ = new factory ();
            }
            return Singleton.__instance__;
        };
        Singleton.hasInstance = function () {
            return Singleton.__instance__ !== null;
        };
        return Singleton;
    },

    /**
     * 페이지이동 ( 새창 or 현재창 )
     *
     * @param {string} linkURL - 페이지이동주소
     * @param {boolean} isOpener - 새창으로 띄울지 여부 ( true: 새창, false: 현재창 )
     */
    navigateToURL: function ( linkURL, isOpener ) {
        if ( isOpener ) {
            window.open ( linkURL, '' );
        } else {
            location.href = linkURL;
        }
    },

    /**
     * 현재URL의 params를 hash로 변환
     *
     * @returns {Object} 키:값형태
     */
    urlParamsToHash: function () {
        var searchQuery = location.search.substring ( 1 ),
            result = queryToHash ( searchQuery, true );

        return result;
    },

    /**
     * url문자열에 파라미터 값 가져오기
     *
     * @param {string} url - URL문자열
     * @param {string} key - 키
     * @returns {string} 파라미터 값
     */
    getParamFromURLString: function ( url, key ) {
        if ( typeof url !== 'string' || !key ) {
            return url;
        }

        var urlData = urlDataFromURLString ( url ),
            params = urlData.params;

        return params [ key ];
    },

    /**
     * url문자열에 파라미터추가
     *
     * @param {string} url - URL문자열
     * @param {string} key - 키
     * @param {string} value - 값
     * @param {boolean} overwrite - 덮어쓰기
     * @returns {string} 파라미터가 추가된 문자열
     */
    setParamToURLString: function ( url, key, value, overwrite ) {
        if ( typeof url !== 'string' || !key ) {
            return url;
        }

        var urlData = urlDataFromURLString ( url ),
            path = urlData.path,
            params = urlData.params,
            hash = urlData.hash,
            resQuery,
            resUrl;

        if ( overwrite || typeof params [ key ] === 'undefined' ) {
            params [ key ] = value;
        }

        resQuery = hashToQuery ( params );
        resUrl = path + ( resQuery ? '?' + resQuery : '' ) + ( hash ? '#' + hash : '' );

        return resUrl;
    },

    /**
     * url문자열에 파라미터 삭제
     *
     * @param {string} url - URL문자열
     * @param {string} key - 키
     * @returns {string} 파라미터가 삭제된 문자열
     */
    removeParamFromURLString: function ( url, key ) {
        if ( typeof url !== 'string' || !key ) {
            return url;
        }

        var urlData = urlDataFromURLString ( url ),
            path = urlData.path,
            params = urlData.params,
            hash = urlData.hash,
            resQuery,
            resUrl;

        delete params [ key ];
        resQuery = hashToQuery ( params );
        resUrl = path + ( resQuery ? '?' + resQuery : '' ) + ( hash ? '#' + hash : '' );

        return resUrl;
    },

    /**
     * url문자열에 파라미터들 추가
     *
     * @param {string} url - URL문자열
     * @param {object} dic - 키:값(String) 으로 이루어진 Hash맵
     * @param {boolean} overwrite - 덮어쓰기
     * @returns {string} 파라미터들이 추가된 문자열
     */
    setParamsToURLString: function ( url, dic, overwrite ) {
        if ( typeof url !== 'string' || !dic ) {
            return url;
        }

        var urlData = urlDataFromURLString ( url ),
            path = urlData.path,
            params = urlData.params,
            hash = urlData.hash,
            resQuery,
            resUrl;

        for ( var key in dic ) {
            if ( overwrite || typeof params [ key ] === 'undefined' ) {
                params [ key ] = dic [ key ];
            }
        }

        resQuery = hashToQuery ( params );
        resUrl = path + ( resQuery ? '?' + resQuery : '' ) + ( hash ? '#' + hash : '' );

        return resUrl;
    },

    /**
     * url문자열에 파라미터들 삭제
     *
     * @param {string} url - URL문자열
     * @param {array} keys - 키값들
     * @returns {string} 파라미터들이 삭제된 문자열
     */
    removeParamsFromURLString: function ( url, keys ) {
        if ( typeof url !== 'string' ) {
            return url;
        }

        var reg = /\?|#/,
            parts = url.split ( reg ),
            path = parts [ 0 ],
            query = parts [ 1 ],
            hashTag = parts [ 2 ],
            queryObj,
            resQuery,
            resUrl;

        if ( typeof query === 'undefined' ) {
            return url;
        }

        queryObj = queryToHash ( query );
        for ( var i = 0, len = keys.length; i < len; i++ ) {
            delete queryObj [ keys [ i ] ];
        }

        resQuery = hashToQuery ( queryObj );
        resUrl = path + ( resQuery ? '?' + resQuery : '' ) + ( hashTag ? '#' + hashTag : '' );

        return resUrl;
    },

    /**
     * Get hash property
     *
     * @param {string} key - hash key
     * @returns {string}
     */
    getHashProperty: function ( key ) {
        var hash = location.hash.substr ( 1 );
        if ( hash.length < 1 ) {
            return null;
        }

        var data = hash.split ( ',' ),
            l = data.length,
            tmp,
            sepIdx = -1,
            k;

        for ( var i = 0; i < l; i++ ) {
            sepIdx = data [ i ].indexOf ( ':' );
            if ( sepIdx > -1 ) {
                k = data [ i ].substr ( 0, sepIdx );
                if ( k === key ) {
                    return data [ i ].substr ( sepIdx + 1 );
                }
            }
        }
        return null;
    },

    /**
     * Set hash property
     *
     * @param {string} key - hash key
     * @param {*} value
     */
    setHashProperty: function ( key, value ) {
        var hash = location.hash.substr ( 1 );

        if ( hash.length < 1 ) {
            hash = key + ':' + value;
            location.hash = hash;
            return true;
        }

        var data = hash.split ( ',' ),
            i,
            l = data.length,
            tmp,
            sepIdx = -1,
            k,
            v,
            hasKey = false;

        for ( i = 0; i < l; i++ ) {
            sepIdx = data [ i ].indexOf ( ':' );
            if ( sepIdx > -1 ) {
                k = data [ i ].substr ( 0, sepIdx );
                if ( k === key ) {
                    if ( hasKey ) {
                        data [ i ] = null;
                    } else {
                        hasKey = true;
                        data [ i ] = [ key, value ];
                    }
                } else {
                    v = data [ i ].substr ( sepIdx + 1 );
                    if ( v.length < 1 ) {
                        data [ i ] = null;
                    } else {
                        data [ i ] = [ k, v ];
                    }
                }
            }
        }

        if ( !hasKey ) {
            data [ i ] = [ key, value ];
        }

        l = data.length;
        hash = '';

        for ( i = 0; i < l; i++ ) {
            if ( _.isString ( data [ i ] ) ) {
                hash += data [ i ];
            } else if ( _.isArray ( data [ i ] ) && data [ i ].length > 1 ) {
                hash += data [ i ][ 0 ] + ':' + data [ i ][ 1 ] + ',';
            }
        }
        hash = hash.substr ( 0, hash.length - 1 );

        location.hash = hash;
    },

    /**
     * HTTP protocol from url
     *
     * @param {string} url - URL문자열
     * @returns {string}
     */
    appendHTTPProtocolFromURLString: function ( url ) {
        if ( url.indexOf ( 'http' ) === 0 ) {
            return url;
        }

        if (url.indexOf ( '//' ) === 0 ) {
            return 'http:' + url;
        }
        return 'http://' + url;
    },

    /**
     * Get protocol from URL
     *
     * @param {string} url - URL문자열
     * @returns {string}
     */
    getProtocolFromURLString: function ( url ) {
        var i = url.indexOf ( '://' );
        if ( i < 0 ) {
            return null;
        }
        return url.substr ( 0, i );
    },

    /**
     * 주어진 문자열에 대해서 html escape를 수행한다
     *
     * @param {string} str - HTML형식의 문자열
     * @returns {string} escape된 문자열
     */
    escapeHtml: function ( str ) {
        if ( typeof str !== 'string' ) {
            return '';
        }

        var ENTITY_MAP = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };

        return String ( str ).replace ( /[&<>"'\/]/g, function ( s ) {
            return ENTITY_MAP [ s ];
        } );
    },

    /**
     * 주어진 문자열에 포함되어 있는 개행문자를 <br>로 치환하여 리턴한다
     *
     * @param {string} str - 개행할 문자열
     * @returns {string} 변환이 완료된 문자열
     */
    replaceCrToBrTag: function ( str ){
        return ( str && typeof str === 'string' ) ? str.replace ( /(\r\n|\n|\r)/g, '<br />' ) : '';
    },

    /**
     * HTML태그 삭제
     *
     * @param {string} str
     * @returns {string}
     */
    removeHtmlTag: function ( str ) {
        return ( str && typeof str === 'string' ) ? str.replace ( /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/gi, '' ) : '';
    },

    /**
     * 특수문자 삭제
     *
     * @param {string} str
     * @returns {string}
     */
    removeSpecialChar: function ( str ) {
        return ( str && typeof str === 'string' ) ? str.replace ( /[\{\}\[\]\/!?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '' ) : '';
    },

    /**
     * 파라미터가 Numeric인지 체크
     *
     * @param {*} num - 체크할 오브젝트
     * @returns {boolean}
     */
    isNumeric: function ( num ) {
        return !isNaN ( parseFloat ( num ) ) && !_.isArray ( num ) && isFinite ( num );
    }
}; // exports