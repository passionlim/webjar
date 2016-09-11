/**
 * Handlebars common helpers 등록
 */


/**
 * [urlDataFromURLString URL형태의 문자열에서 도메인과 파라미터정보 가져오기]
 * @return {[Object]} [키:값형태]
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
        delimeter = ( d == '?' ) ? '[?]' : '[#]';
        return delimeter;
    } );

    if ( delimeter == '[?]' ) {
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

    } else if ( delimeter == '[#]' ) {
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
    }
}

/**
 * [hashToQuery object를 쿼리형문자열로 변환]
 * @param  {[type]} obj [변환할 object]
 * @return {[String]}
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
 * [queryToHash id=123445&catecory=javascript등과 같은 쿼리형문자열을 해시값으로 변환]
 * @param  {[String]}  q             [쿼리를 추출할 문자열( ex) id=123445&catecory=javascript )]
 * @param  {Boolean} isTraditional [키값이 array를 나타내는 'arr[]'일때 키값을 arr로 변경여부 ( true: 변경, false: 변경하지 않음 )]
 * @return {[Object]}                [키:값형태]
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
        if ( params [ i ].length == 0 ) {
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
            if ( key.substr ( key.length - 2 ) != '[]' ) {
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


//조건 만족
/*
 * @param
 * condition (String)
 */
Handlebars.registerHelper ( 'isCondition', function ( condition, options ) {
    var fn = function ( ) { }, result;
    try {
        fn = Function.apply(
            this,
            [
                'window',
                'return ' + condition + ';' ]
        );
    } catch (e) {
        console.warn('[warning] {{x ' + condition + '}} is invalid javascript', e);
    }
    try {
        result = fn.call(this, window);
    } catch (e) {
        console.warn('[warning] {{x ' + condition + '}} runtime error', e);
    }

    if ( result ) {
        return options.fn ( this );
    } else {
        return options.inverse ( this );
    }
});

// 단순비교
Handlebars.registerHelper ( 'is', function ( lvalue, operator, rvalue, options ) {
    var operators,
        result;

    if ( arguments.length < 3 ) {
        throw new Error ( "Handlerbars Helper 'compare' needs 2 parameters" );
    }

    operators = {
        '==': function ( l, r ) { return l == r; },
        '===': function ( l, r ) { return l === r; },
        '!=': function ( l, r ) { return l != r; },
        '!==': function ( l, r ) { return l !== r; },
        '<': function ( l, r ) { return l < r; },
        '>': function ( l, r ) { return l > r; },
        '<=': function ( l, r ) { return l <= r; },
        '>=': function ( l, r ) { return l >= r; },
        '&&': function ( l, r ) { return l && r; },
        '||': function ( l, r ) { return l || r; },
        'typeof': function ( l, r ) { return typeof l == r; }
    };

    if (!operators [ operator ] ) {
        throw new Error ( "Handlerbars Helper 'compare' doesn't know the operator " + operator );
    }

    result = operators [ operator ] ( lvalue, rvalue );
    return result;
} );

// 비교
Handlebars.registerHelper ( 'compare', function ( lvalue, operator, rvalue, options ) {
    var operators,
        result;

    if ( arguments.length < 3 ) {
        throw new Error ( "Handlerbars Helper 'compare' needs 2 parameters" );
    }

    if ( options === undefined ) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }

    operators = {
        '==': function ( l, r ) { return l == r; },
        '===': function ( l, r ) { return l === r; },
        '!=': function ( l, r ) { return l != r; },
        '!==': function ( l, r ) { return l !== r; },
        '<': function ( l, r ) { return l < r; },
        '>': function ( l, r ) { return l > r; },
        '<=': function ( l, r ) { return l <= r; },
        '>=': function ( l, r ) { return l >= r; },
        '&&': function ( l, r ) { return l && r; },
        '||': function ( l, r ) { return l || r; },
        'typeof': function ( l, r ) { return typeof l == r; }
    };

    if (!operators [ operator ] ) {
        throw new Error ( "Handlerbars Helper 'compare' doesn't know the operator " + operator );
    }

    result = operators [ operator ] ( lvalue, rvalue );

    if ( result ) {
        return options.fn ( this );
    } else {
        return options.inverse ( this );
    }
} );

// 숫자비교
Handlebars.registerHelper ( 'compareNumber', function ( lvalue, operator, rvalue, options ) {
    var operators,
        result;

    if ( arguments.length < 3 ) {
        throw new Error ( "Handlerbars Helper 'compare' needs 2 parameters" );
    }

    if ( options === undefined ) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }

    operators = {
        '==': function ( l, r ) { return l == r; },
        '===': function ( l, r ) { return l === r; },
        '!=': function ( l, r ) { return l != r; },
        '!==': function ( l, r ) { return l !== r; },
        '<': function ( l, r ) { return l < r; },
        '>': function ( l, r ) { return l > r; },
        '<=': function ( l, r ) { return l <= r; },
        '>=': function ( l, r ) { return l >= r; },
        'typeof': function ( l, r ) { return typeof l == r; }
    };

    if (!operators [ operator ] ) {
        throw new Error ( "Handlerbars Helper 'compare' doesn't know the operator " + operator );
    }

    result = operators [ operator ] ( parseFloat(lvalue), parseFloat(rvalue) );

    if ( result ) {
        return options.fn ( this );
    } else {
        return options.inverse ( this );
    }
} );

// n번 반복
Handlebars.registerHelper ( 'times', function ( n, block ) {
    var accum = '';
    for ( var i = 0; i < n; i++ ) {
        accum += block.fn ( i );
    }
    return accum;
} );

// for loop
Handlebars.registerHelper ( 'for', function ( from, to, incr, block ) {
    var accum = '';
    for ( var i = from; i < to; i += incr ) {
        accum += block.fn ( i );
    }
    return accum;
} );

Handlebars.registerHelper('formatNumber', function(value) {
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
        result = nagative + ( ( start != 0 ) ? natural.substr ( 0, start ) + ',' : '' ) + natural.substr ( start ).replace ( /(\d{3})(?=\d)/g, '$1,' ) + ( decimal ? '.' + decimal : '' );

    function unformat ( value ) {
        if ( typeof value === 'number' ) {
            return value;
        } else if ( typeof value === 'string' && value != '') {
            if ( /[^0-9-.,]/g.test ( value ) ) {
                return undefined;
            } else {
                return parseFloat ( value.replace ( /[^0-9-.]/g, '' ) );
            }
        }
        return undefined;
    }

    return result;
});

Handlebars.registerHelper ( 'setParamToURLString', function ( url, key, value, overwrite ) {
    /*
    var resUrl = util.setParamToURLString ( url, key, value, overwrite );
    return resUrl;
    */
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

} );

Handlebars.registerHelper ( 'isEmpty', function ( value, options ) {
    var result = Handlebars.Utils.isEmpty( value );

    if ( result ) {
        return options.fn ( this );
    } else {
        return options.inverse ( this );
    }
} );

Handlebars.registerHelper ( 'isNotEmpty', function ( value, options ) {
    var result = Handlebars.Utils.isEmpty( value );

    if ( result ) {
        return options.inverse ( this );
    } else {
        return options.fn ( this );
    }
} );

// \r,\n 줄바꿈처리
Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper ( 'removeHtmlTagChar', function ( value ) {
    return value.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
} );