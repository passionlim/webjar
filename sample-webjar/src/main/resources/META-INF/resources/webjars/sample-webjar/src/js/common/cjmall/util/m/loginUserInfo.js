/**
 * CJmall 간단한 로그인정보 가져오기
 *
 * @module common/cjmall/mobile/util/loginUserInfo
 * @requires: module: common/cjos/mobile/util/jspVariables
 */
var jspVariables = require ('common/cjos/util/jspVariables');


var info = null,
    isInit = false,
    subcriberList = [];

function init () {
    isInit = true;
    $.ajax ( {
        url: jspVariables.get ( 'mobileSslUrl' ) + '/api/user/loginUserInfo.json',
        xhrFields: {
            withCredentials: true // https 호출시
        },
        success: function ( data ) {
            if ( jsonValidate ( data ) ) {
                var result = data.result;
                info = {
                    isDone: true,
                    isLogin: result.isLogin,
                    isEmployee: result.isEmployee,
                    isBadCust: result.isBadCust,
                    isSimple: result.isSimple,
                    memberId: result.memberId,
                    simpleCustNo: result.simpleCustNo,
                    certYn: result.certYn,
                    age: ( result.age ) ? parseInt ( result.age, 10 ) : 0
                };
            } else {
                info = {
                    isDone: false,
                    isLogin: false,
                    isEmployee: false,
                    isBadCust: false,
                    isSimple: false,
                    memberId: '',
                    simpleCustNo: '',
                    certYn: false,
                    age: 0
                };
            }
            publish ();
        },
        fail: function () {
            info = {
                isDone: false,
                isLogin: false,
                isEmployee: false,
                isBadCust: false,
                isSimple: false,
                memberId: '',
                simpleCustNo: '',
                certYn: false,
                age: 0
            };
            publish ();
        }
    } );
}

function jsonValidate ( data ) {
    if ( !data || data.code === 0 || !data.result ) {
        return false;
    }
    return true;
}

function publish () {
    for ( var i = 0, len = subcriberList.length; i < len; i++ ) {
        var callback = subcriberList [ i ].callback,
            context = subcriberList [ i ].context;

        if ( context ) {
            callback.apply ( callback, [ info ] );
        } else {
            callback ( info );
        }
    }
}

module.exports = {
    get: function ( callback, context ) {
        if ( info ) {
            if ( context ) {
                callback.apply ( callback, [ info ] );
            } else {
                callback ( info );
            }
            return;
        }

        if ( !isInit ) {
            init ();
        }

        subcriberList.push ( {
            context: context,
            callback: callback
        } );
    }
};