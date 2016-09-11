/**
 * CJmall에서 사용하는 유틸함수 모음
 *
 * @module common/cjmall/mobile/util/util
 * @requires module:common/cjos/mobile/util/userAgentUtil
 * @requires module:common/cjmall/mobile/util/jsConstants
 */

var userAgentUtil = require ('common/cjos/util/userAgentUtil'),
    jsConstants = require ('common/cjmall/util/m/jsConstants');

module.exports = {
    /**
     * 19금 상품 구분을 위한 조회
     *
     * @param {number} harmGrd - harmGrade값
     * @returns {boolean}
     */
    getHarmGrd: function ( harmGrd ) {

        if ( _.isNull ( harmGrd ) || _.isUndefined ( harmGrd ) || '' === harmGrd || 0 === harmGrd){
            return true;
        }

        /* 상세에서 사용하는 로직이나 GLOBAL변수로 변경
         d = new Date(),
         currentYear = jspVariables.get('tDate') != null && jspVariables.get('tDate') != 'undefined' ? jspVariables.get('tDate') : d.getFullYear().toString(),
         certYn = Cookies.get('M_CERT_YN') != null && Cookies.get('M_CERT_YN') != 'undefined' ? Cookies.get('M_CERT_YN') : 0,
         resdno = Cookies.get('M_RESDNO') != null && Cookies.get('M_RESDNO') != 'undefined' ? Cookies.get('M_RESDNO').substring(0,2) : 0,
         age = currentYear - (currentYear.substring(2,4) > 14 ? 19 + resdno : 20 + resdno );
         */
        var harmGrdAge = harmGrd,
            jsGLOBAL = jsConstants.GLOBAL,
            certYn =jsGLOBAL.CERT_YN,
            age = jsGLOBAL.M_AGE,
            harmGrade =  (certYn) ? ( ( age > harmGrdAge ) ? true : false ): false; //인증한고객중 hamgrade보다 나이가 크면 true 적합하지않으면 false
        return harmGrade;
    },

    /**
     * 상품이미지URL 생성
     *
     * @param {string} itemCode - 아이템코드
     * @param {string} moCodeImg - 묶음코드 이미지URL : 값이 존재하면 묶음코드 대표이미치로 처리함
     * @returns {string} 상품이미지URL
     */
    getImgUrl: function ( itemCode, moCodeImg ) {
        var path = itemCode.substring ( 0, 2 ) + '/' + itemCode.substring ( itemCode.length - 3 ) + '/',
            file = itemCode + 'K.jpg',
            imgUrl = '',
            prefixImgUrl = '//itemimage.cjmall.com/goods_images/',
            mocodePrefixImgUrl = '//image.cjmall.com/cjupload/banner/page/';

        if ( moCodeImg ) {
            imgUrl = moCodeImg;
        } else {
            imgUrl = prefixImgUrl + path + file;
        }

        return imgUrl;
    },
    
    /**
     * 상품상세링크URL 생성
     *
     * @param {string} itemCode - 아이템코드
     * @param {string} channelCode - 채널코드
     * @param {string} moCode - 묶음코드
     * @returns {string} 링크URL
     */
    getLinkUrl: function ( itemCode, channelCode, moCode ) {
        if ( moCode ) {
            // 모코드 이미지 return
            linkUrl = '/m/mocode/' + moCode;
        } else {
            linkUrl = '/m/item/' + itemCode + '?chn_cd=' + channelCode;
        }
        return linkUrl;
    },
    
    /**
     * 로그인페이지로 이동
     */
    goLoginPage: function () {
        var curURL = location.href,
            mobileSslUrl = jspVariables.get ( 'mobileSslUrl' ),
            defaultAndParam = jspVariables.get ( 'defaultAndParam' ),
            targetHref = mobileSslUrl + '/m/login/login.jsp?pic=btn_login'+ defaultAndParam;

        if ( curURL.indexOf ( '/m/login/login.jsp' ) > -1 || curURL.indexOf ( '/m/login/login_adult_check.jsp' ) > -1 ) {

        } else {
            targetHref += '&returnUrl=' + encodeURIComponent ( curURL );
        }
        location.href = targetHref;
    },
    
    /**
     * 에러메시지 출력후 replace
     *
     * @param {string} message - 출력(alert)할 에러메시지
     * @param {string} replaceUrl - replace url
     */
    alertAndReplace: function ( message, replaceUrl ) {
        if ( message ) {
            alert ( message );
        }

        if ( replaceUrl ) {
            location.replace( replaceUrl );
        } else {
            if ( userAgentUtil.getIsApp () && cjosapi ) {
                cjosapi.back ();
            } else if ( history && history.length > 1 ) {
                history.back ( -1 );
            } else {
                location.replace( '/m/page.jsp' + ( jspVariables.get ( 'defaultParam' ) ? '?' + jspVariables.get ( 'defaultParam' ) : '' ) ) ;
            }
        }
    },
    
    /**
     * 에러메시지 출력후 redirect
     *
     * @param {string} message - 출력(alert)할 에러메시지
     * @param {string} redirectUrl - redirect url
     */
    alertAndRedirect: function ( message, redirectUrl ) {
        if ( message ) {
            alert ( message );
        }

        if ( redirectUrl ) {
            location.href = redirectUrl;
        } else {
            if ( userAgentUtil.getIsApp () && cjosapi ) {
                cjosapi.back ();
            } else if ( history && history.length > 1 ) {
                history.back ( -1 );
            } else {
                location.href = '/m/page.jsp' + ( jspVariables.get ( 'defaultParam' ) ? '?' + jspVariables.get ( 'defaultParam' ) : '' );
            }
        }
    },
    

    /**
     * PC 페이지이동
     *
     * @param {string} url - 페이지이동주소
     * @param {string} target - 새창이름
     */
    pcVersion: function ( url, target ) {
        if( Cookies.get ( 'mobiletype' ) ) {
            Cookies.remove ( 'mobiletype', { path: '' } );
        }
        Cookies.set ( 'mobiletype', 'N', {  path: '/' ,domain:'.cjmall.com' } );
        window.open ( url, target );
    }
};
