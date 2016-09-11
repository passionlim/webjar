/**
 * CJmall에서 사용되는 페이지 맨위로(Top)버튼
 *
 * [APP일 경우]
 * 1. 네이티브 영역은 모두 앱에서 top 버튼 노출함
 * 2. 상품상세, 묶음코드상세, 보험은 웹에서 top 버튼 노출함
 * 3. 하단 메뉴가 있는 부분은 앱에서 노출한다고 보면됨
 *
 * @module common/cjmall/mobile/ui/scrollTopButton
 * @requires module:common/cjos/mobile/util/userAgentUtil
 * @requires module:common/cjos/mobile/util/util
 * @requires module:common/cjos/mobile/util/eventProxyManager
 * @requires module:common/cjmall/mobile/util/eventProxyTypes
 */

//import
var uaUtil            = require ('common/cjos/util/userAgentUtil'),
    util              = require ('common/cjos/util/util'),
    eventProxyManager = require ('common/cjos/util/eventProxyManager'),
    eventProxyTypes   = require ('common/cjmall/util/m/eventProxyTypes');

// singleton pattern
var ScrollTopButton  = function () {

    var isCJmallApp = uaUtil.getIsCjmallApp (),
        $wnd = $ ( window ),
        $doc = $ ( document ),
        btnWidth = 48,
        btnHeight = 50,
        bottomMargin = 46,
        useFixed = jindo.m.useFixed (),
        $btn = null,
        timer = null,
        isIng = false,
        duration = 2000; // 화면에 보여지는 시간

    function init () {
        if ( isCJmallApp ) {
            var pathName = location.pathname,
                detailReg = /\/m\/item\/[^/]+$/, // 상품상세
                mocodeReg = /mocode\/M\d*/i;     // 묶음코드상세

            if ( !mocodeReg.test ( pathName ) && !detailReg.test ( pathName ) ) {
                return;
            }
        }

        $btn = $ ( '<a href="#" class="fixed_btns scroll_top" spcid="btn_top">맨위로</a>' );
        $btn.css ( {
            position: 'fixed',
            zIndex: 999,
            right: 7,
            bottom: bottomMargin
        } );

        if ( !useFixed ) {
            var st = $doc.scrollTop (),
            	clientH = $wnd.height (),
                targetTop = st + clientH - btnHeight - bottomMargin;

            $btn.css ( { position: 'absolute', top: targetTop } );
        }

        $btn.hide ();
        $ ( '#o1h_wrap' ).after ( $btn );
        addEventListeners ();
        show ();
    }

    function addEventListeners () {
        $btn.on ( 'click', btnClickHn );
        $wnd.on ( 'scroll', scrollHn );

        //full layer일 때 스크롤링이벤트가 발생했을 때
        eventProxyManager.listen ( eventProxyTypes.ITEM.FULL_SCROLLING, scrollHn );
    }

    function show ( e ) {
        if ( isIng ) {
            return;
        }

        if ( !_.isUndefined ( e ) && e.type ===  eventProxyTypes.ITEM.FULL_SCROLLING ) {
            //Full layer인 경우
            if ( e.nTop > -50 ) {
                hide ();
                return;
            }
        }
        else{
            if ( $doc.scrollTop () < 50 ) {
                hide ();
                return;
            }
        }

        isIng = true;

        if ( useFixed ) {
            $btn.stop ().fadeIn ( function () {
                isIng = false;
            } );
        } else {
            $btn.stop ().fadeIn ( 0 );
            isIng = false;
        }
    }

    function hide () {
        if ( useFixed ) {
            $btn.stop ().fadeOut ();
        } else {
            $btn.stop ().fadeOut ( 0 );
        }
    }

    function btnClickHn ( e ) {
        e.preventDefault ();

        if ( $btn.data ( eventProxyTypes.ITEM.FULL_BTN_TOP ) ) {
            eventProxyManager.trigger ( eventProxyTypes.ITEM.FULL_GO_TOP );
            return;
        }
        $doc.scrollTop ( 0 );
    }
    
    function scrollHn ( e , params ) { 	// @ params : jindo scroll event (full layer 일경우 )

        if ( timer ) {
            clearTimeout ( timer );
        }

        if ( e.type === eventProxyTypes.ITEM.FULL_SCROLLING ) {
        	e = _.extend ( e, params );
        }
        show ( e );

        //timer = setTimeout ( hide, duration );

        if ( !useFixed ) {
            var st = $doc.scrollTop (),
            	clientH = $wnd.height (),
                targetTop = st + clientH - btnHeight - bottomMargin;

            $btn.css ( { position: 'absolute', top: targetTop } );
        }
    }

    $doc.ready ( init );
};

module.exports = util.getSingleton ( ScrollTopButton );