/**
 * CJmall에서 사용되는 화면전체 딤드처리 UI
 *
 * @module m/common/cjmall/ui/dimmed
 */

var Dimmed = function () {
    var s = this;
    s.moveRange = 50;
    s.pos = { startX: 0, startY: 0 };
    s.hasMoved = false;
    s.initialize ();
};
Dimmed.prototype = {
    initialize: function () {
        var s = this,
            $el = $ ( '<div></div>' ),
            touchHnBind = _.bind ( s.touchHn, s );

        $el.css ( {
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
        } );

        s.$el = $el;
        s.touchHnBind = touchHnBind;
        s.oTransition = ( jindo.m.useCss3d () ) ? new jindo.m.Transition () : null;
    },

    touchHn: function ( e ) {
        var s = this,
            pos = s.pos,
            moveRange = s.moveRange;

        switch ( e.type ) {
            case 'touchstart':
                pos.startX = e.originalEvent.touches [ 0 ].pageX;
                pos.startY = e.originalEvent.touches [ 0 ].pageY;
                s.hasMoved = false;
                break;
            case 'touchmove':
                e.preventDefault ();
                if ( Math.abs ( e.originalEvent.touches [ 0 ].pageX - pos.startX ) > moveRange || Math.abs ( e.originalEvent.touches [ 0 ].pageX - pos.startY ) > moveRange ) {
                    s.hasMoved = true;
                }
                break;
            case 'touchend':
            case 'touchcancel':
                if ( !s.hasMoved ) {
                    s.$el.trigger ( 'click' );
                }
                s.hasMoved = false;
                break;
        }
    },

    /**
     * 보이기
     * @param {number} duration
     */
    show: function ( duration ) {
        var s = this,
            $el = s.$el;

        $el.on ( 'touchstart touchmove touchend touchcancel', s.touchHnBind );
        if ( s.oTransition ) {
            s.oTransition.queue ( $el.get ( 0 ), duration, {
                htStyle : { 'display': 'block', 'opacity': '1' },
            } ).start ();
        } else {
            $el.fadeIn ( duration );
        }

    },

    /**
     * 감추기
     * @param {number} duration
     */
    hide: function ( duration ) {
        var s = this,
            $el = s.$el;

        $el.off ( 'touchstart touchmove touchend touchcancel', s.touchHnBind  );
        if ( s.oTransition ) {
            $el.display = "block";
            s.oTransition.queue ( $el.get ( 0 ), duration, {
                htStyle : { 'display': 'block', 'opacity': '0' },
                fCallback: function () {
                    $el.css ( 'display', 'none' );
                }
            } ).start ();
        } else {
            $el.fadeOut ( duration );
        }
    }
};

module.exports = Dimmed;