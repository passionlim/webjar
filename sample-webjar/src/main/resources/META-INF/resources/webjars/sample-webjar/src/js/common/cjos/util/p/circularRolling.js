var canIUseUtil						= require ('common/cjos/util/canIUseUtil');
var	jqueryPluginManager 			= require ('common/cjos/util/jqueryPluginManager');
var	jqueryCircularRollingBasicItem  = require ('common/cjos/util/p/circularRollingBasicItem');

var CircularRolling = function (options) {
	var $that = this,
		opts = $.extend ({}, CircularRolling.defaults, options);
	
	jqueryPluginManager.setPlugin ('circularRollingBasicItem', jqueryCircularRollingBasicItem);
	
	// 멤버변수 설정
	$that.opts = opts;
	$that.movingFlag = false;
	$that.currentSlideIndex = 0;
	$that.$currentSlide = null;
	$that.slideTotal = 0;
	$that.viewNum = 0;
	$that.rollingTimer = null;
	
	$that.has3d = canIUseUtil.has3d ();
	$that.transform = null;
	
	if ( opts.use3d && $that.has3d ) {
		$that.transform = canIUseUtil.transformProp ();
		$that.transition = canIUseUtil.transtionProp ();
		//$that.transitionEnd = CJOSCommon.util.transtionendName;
	}
	
	// 메소드 바인딩
	switch ( opts.moveType ) {
		case 'simple':
			CircularRolling.method.moveTo = CircularRolling.method.moveToSimple;
			break;
		case 'fade':
			CircularRolling.method.moveTo = CircularRolling.method.moveToFade;
			break;
		case 'fadeExtend':
			CircularRolling.method.moveTo = CircularRolling.method.moveToFadeExtend;
			break;
		case 'infinite':
			CircularRolling.method.moveTo = CircularRolling.method.moveToInfinite;
			CircularRolling.method.over = CircularRolling.method.overToInfinite;
			CircularRolling.method.out = CircularRolling.method.outToInfinite;
			break;
	}
	$.extend ($that, CircularRolling.method);
	
	// 초기화
	$that.init ();
	return $that;
};

CircularRolling.defaults = {
	wrapper: null,
	duration: 700,
	moveWidth: 980,
	moveType: 'simple',
	ease: 'easeOut',
	viewNum: 1,
	slidesSelector: '.circular_slide',
	nextBtn: null,
	prevBtn: null,
	hasCounting: true,
	isPreventEvent: false,
	use3d: true,
	autoRolling: false,
	autoRollingDuration: 10000,
	selectEventType: 'click',
	startAt: 0
};

CircularRolling.method = {
	init: function () {
		var $that = this,
			opts = $that.opts;

		$that.slides = $that.setSlides ($that.find (opts.slidesSelector));
		$that.slideTotal = $that.slides.length;
		$that.viewNum = opts.viewNum;
		$that.rollingUpdateScope = _.bind ($that.rollingUpdate, $that);
		

		if ($that.slideTotal) {
			var $currentSlide = $that.slides [$that.currentSlideIndex];
			if (!$currentSlide.is (':visible')) {
				$currentSlide.css ({display: 'block'});
			}
			$that.addEventListeners ();
		}
		if (opts.startAt && opts.startAt < $that.slideTotal) {
			$that.moveTo (opts.startAt, 1, 0);
		}
	},
	addEventListeners: function () {
		var $that = this,
			opts = $that.opts,
			$nextBtn = opts.nextBtn,
			$prevBtn = opts.prevBtn;
		
		if ($nextBtn && $prevBtn) {
			$prevBtn.on ('mouseover mouseout click', {$delegateTarget: $that}, $that.prevHn);
			$nextBtn.on ('mouseover mouseout click', {$delegateTarget: $that}, $that.nextHn);
			if ($that.slideTotal < 2) {
				$nextBtn.css ({display: 'none'});
				$prevBtn.css ({display: 'none'});
			} else if (opts.autoRolling) {
				$that.rollingStart ();
				if (opts.wrapper) {
					opts.wrapper.on ('mouseenter mouseleave', {$delegateTarget: $that}, $that.enterLeaveHn);
				} else {
					$that.on ('mouseenter mouseleave', {$delegateTarget: $that}, $that.enterLeaveHn);
				}
				
			}
			if (opts.hasCounting) {
				$that.on ( 'beforeMove', {$currentTarget: $that}, $that.updateCountingHn);
				var counterStr = '<span class="page_wrap"><strong class="prevnext">' + ($that.currentSlideIndex + 1) + '</strong> / <span class="total">' + $that.slideTotal +'</span></span>',
					$nextCounter = $ (counterStr),
					$prevCounter = $nextCounter.clone ();

				$nextBtn.data ('$current', $nextCounter.find ('.prevnext'));
				$prevBtn.data ('$current', $prevCounter.find ('.prevnext'));
				
				$nextBtn.find ('> a').prepend ($nextCounter);
				$prevBtn.find ('> a').append ($prevCounter);

				$that.$nextBtn = $nextBtn;
				$that.$prevBtn = $prevBtn;
			}
		}
	},
	setSlides: function ($slides) {
		var $that = this,
			opts = $that.opts,
			moveType = opts.moveType,
			totalWidth = 0,
			arr = [];

		if (moveType === 'infinite' || moveType === 'fade' || moveType === 'fadeExtend') {
			$slides.css ({display: 'none', position: 'absolute', top:0, left: 0});
		}
		for (var i = 0, len = $slides.length; i < len; i++) {
			var $slide = $slides.eq (i).circularRollingBasicItem ({
					index: i,
					isPreventDefault: opts.isPreventDefault,
					selectEventType: opts.selectEventType
				});
			$slide.on ('select', {$currentTarget: $that}, $that.slideSelectHn);
			totalWidth += $slide.outerWidth ();
			arr.push ($slide);
		}
		$that.css ({width: totalWidth});
		return arr;
	},
	getSlides: function () {
		return this.slides;
	},
	getSlide: function (index) {
		return this.slides [index];
	},
	isMoving: function () {
		return this.movingFlag;
	},
	prevSlide: function () {
		var $that = this,
			targetIndex = $that.getTargetIndex ('prev');
		$that.moveTo (targetIndex, -1);
	},
	nextSlide: function () {
		var $that = this,
			targetIndex = $that.getTargetIndex ('next');
		$that.moveTo (targetIndex, 1);
	},
	rollingStop: function () {
		var $that = this;
		if ($that.rollingTimer) {
			clearTimeout ($that.rollingTimer);
		}
	},
	rollingStart: function () {
		var $that = this,
			duration = $that.opts.autoRollingDuration;
		$that.rollingStop ();
		$that.rollingTimer = setTimeout ($that.rollingUpdateScope, duration);
	},
	rollingUpdate: function () {
		var $that = this,
			duration = $that.opts.autoRollingDuration;
		$that.nextSlide ();
		$that.rollingTimer = setTimeout ($that.rollingUpdateScope, duration);
	},
	updateCounting: function (index) {
		var $that = this,
			cur = index + 1,
			total = $that.slideTotal;

		$that.$nextBtn.data ('$current').text (cur);
		$that.$prevBtn.data ('$current').text (cur);
	},
	moveTo: null,
	moveToSimple: function (index, direction) {
		var $that = this,
			opts = $that.opts,
			ease = opts.ease,
			slides = $that.slides,
			viewNum = opts.viewNum,
			curIndex = $that.currentSlideIndex,
			curPagingNum = Math.floor ( curIndex / viewNum ),
			targetPagingNum = Math.floor ( index / viewNum ),
			moveWidth = $that.opts.moveWidth,
			$curSlide = slides [ curIndex ],
			$targetSlide = slides [ index ],
			dur = opts.duration;

		$that.movingFlag = true;

		var beforeEvt = $.Event ( 'beforeMove' );
		beforeEvt.beforeIndex = curIndex;
		beforeEvt.index = index;
		beforeEvt.$currentTarget = $that;
		$that.trigger ( beforeEvt );
		
		if ( curPagingNum !== targetPagingNum ) {
			var targetX = -targetPagingNum * moveWidth,
				changeEvt = $.Event ( 'pageChange' );
			changeEvt.index = index;
			changeEvt.pageIndex = targetPagingNum;
			changeEvt.$currentTarget = $that;
			$that.trigger ( changeEvt );
			
			$that.stop ().animate ( { left: targetX }, dur, ease, function () {
					$that.movingFlag = false;
					var afterEvt = $.Event ( 'afterMove' );
					afterEvt.index = index;
					afterEvt.$currentTarget = $that;
					$that.trigger ( afterEvt );
				} );
		} else {
			$that.movingFlag = false;
			var afterEvt = $.Event ( 'afterMove' );
			afterEvt.index = index;
			afterEvt.$currentTarget = $that;
			$that.trigger ( afterEvt );
		}

		$that.currentSlideIndex = index;
	},
	moveToFade: function ( index, pDirection ) {
		var $that = this,
			opts = $that.opts,
			ease = opts.ease,
			slides = $that.slides,
			curIndex = $that.currentSlideIndex,
			$curSlide = slides [ curIndex ],
			$targetSlide = slides [ index ],
			direction = ( pDirection ) ? pDirection : index - curIndex,
			moveWidth = opts.moveWidth,
			dur = opts.duration;
		
		$that.movingFlag = true;

		var beforeEvt = $.Event ( 'beforeMove' );
		beforeEvt.index = index;
		beforeEvt.beforeIndex = curIndex;
		beforeEvt.$currentTarget = $that;
		$that.trigger ( beforeEvt );
		if ( direction ) {
			$curSlide.stop ().
				css ( { zIndex: 1 } ).
				animate ( { opacity: 0 }, dur, function () {
					$curSlide.css ( { display: 'none' } );
				} );
			$targetSlide.stop ().
				css ( { opacity: 0, zIndex: 8, display: 'block' } ).
				animate ( { opacity: 1 }, dur, function () {
					$that.movingFlag = false;
					var afterEvt = $.Event ( 'afterMove' );
					afterEvt.index = index;
					afterEvt.$currentTarget = $that;
					$that.trigger ( afterEvt );
				} );
		}

		$that.currentSlideIndex = index;
	},
	moveToFadeExtend: function ( index, pDirection, duration ) {
		var $that = this,
			opts = $that.opts,
			ease = opts.ease,
			slides = $that.slides,
			curIndex = $that.currentSlideIndex,
			$curSlide = slides [ curIndex ],
			$targetSlide = slides [ index ],
			direction = ( pDirection ) ? pDirection : index - curIndex,
			moveWidth = opts.moveWidth,
			dur = ( typeof duration !== 'undefined' ) ? duration : opts.duration;
		
		$that.movingFlag = true;

		var beforeEvt = $.Event ( 'beforeMove' );
		beforeEvt.index = index;
		beforeEvt.beforeIndex = curIndex;
		beforeEvt.$currentTarget = $that;
		$that.trigger ( beforeEvt ); 

		if ( direction ) {
			var moveIndex = direction / Math.abs ( direction ),
				hidePos = -moveIndex * moveWidth / 10,
				showPos = moveIndex * moveWidth / 10;
			
			if ( opts.use3d && $that.transform ) {
				var transform = $that.transform,
					transition = $that.transition,
					transitionEnd = $that.transitionEnd,
					hideCssProp = {},
					showCssProp = {};
				hideCssProp.opacity = 0;
				hideCssProp.zIndex = 1;
				hideCssProp [ transform ] = 'translate3d(' + hidePos + 'px,0px,0px)';
				hideCssProp [ transition ] = 'all ' + dur + 'ms ease-out';
				
				showCssProp.display = 'block';
				showCssProp.zIndex = 8;
				showCssProp.opacity = 0;
				showCssProp [ transform ] = 'translate3d(' + showPos + 'px,0px,0px)';
				
				$targetSlide.css ( showCssProp );
				
				setTimeout ( function () {
					$curSlide.off ( 'transitionend' ).one ( 'transitionend', function ( e ) {
						$curSlide.css ( { display: 'none' } );
					} ).css ( hideCssProp );

					showCssProp.opacity = 1;
					showCssProp [ transform ] = 'translate3d(0px,0px,0px)';
					showCssProp [ transition ] = 'all ' + dur + 'ms ease-out';

					$targetSlide.off ( 'transitionend' ).one ( 'transitionend', function () {
						$that.movingFlag = false;
						var afterEvt = $.Event ( 'afterMove' );
						afterEvt.index = index;
						afterEvt.$currentTarget = $that;
						$that.trigger ( afterEvt );
					} ).css ( showCssProp );
				}, 1 );
			
			} else {
				$curSlide.stop ().
					css ( { zIndex: 1 } ).
					animate ( { left: hidePos, opacity: 0 }, dur, ease, function () {
						$curSlide.css ( { display: 'none' } );
					} );
				
				$targetSlide.stop ().
					css ( { left: showPos, opacity: 0, zIndex: 8, display: 'block' } ).
					animate ( { left: 0, opacity: 1 }, dur, ease, function () {
						$that.movingFlag = false;
						var afterEvt = $.Event ( 'afterMove' );
						afterEvt.index = index;
						afterEvt.$currentTarget = $that;
						$that.trigger ( afterEvt );
					} );
			}
		}

		$that.currentSlideIndex = index;
	},
	moveToInfinite: function ( index, pDirection ) {
		var $that = this,
			isMoving = $that.isMoving (),
			opts = $that.opts,
			ease = opts.ease,
			slides = $that.slides,
			curIndex = $that.currentSlideIndex,
			$curSlide = slides [ curIndex ],
			$targetSlide = slides [ index ],
			direction = ( pDirection ) ? pDirection : index - curIndex,
			moveWidth = opts.moveWidth,
			dur = opts.duration;

		if ( isMoving ) {
			return;
		}
		
		$that.movingFlag = true;

		var beforeEvt = $.Event ( 'beforeMove' );
		beforeEvt.index = index;
		beforeEvt.beforeIndex = curIndex;
		beforeEvt.$currentTarget = $that;
		$that.trigger ( beforeEvt );

		if ( direction ) {
			var moveIndex = direction / Math.abs ( direction ),
				hidePos = -moveIndex * moveWidth,
				showPos = moveIndex * moveWidth;

			if ( !$targetSlide.is ( ':visible' ) ) {
				$targetSlide.css ( { left: showPos, display: 'block' } );
			}
			$that.animate ( { left: hidePos }, dur, ease, function () {
				$curSlide.css ( { display: 'none' } );
				$targetSlide.css ( { left: 0 } );
				$that.css ( { left: 0 } );
				$that.movingFlag = false;
				var afterEvt = $.Event ( 'afterMove' );
				afterEvt.index = index;
				afterEvt.$currentTarget = $that;
				$that.trigger ( afterEvt );
			} );
		}

		$that.currentSlideIndex = index;
	},
	over: function () {},
	out: function () {},
	overToInfinite: function ( direction ) {
		if ( this.isMoving () ) {
			return;
		}
		var $that = this,
			opts = $that.opts,
			curIndex = $that.currentSlideIndex,
			slides = $that.slides,
			moveWidth = opts.moveWidth,
			showPos = direction * moveWidth,
			effectWidth = 100 * -direction,
			$effectSlide1 = slides [ curIndex ],
			$effectSlide2 = slides [ $that.getTargetIndex ( direction ) ];

		$effectSlide2.css ( { left: showPos, display: 'block' } );
		$that.stop ().animate ( { left: effectWidth }, 300 );
	},
	outToInfinite: function ( direction ) {
		if ( this.isMoving () ) {
			return;
		}
		var $that = this,
			opts = $that.opts,
			curIndex = $that.currentSlideIndex,
			slides = $that.slides,
			moveWidth = opts.moveWidth,
			hidePos = direction * moveWidth,
			$effectSlide1 = slides [ curIndex ],
			$effectSlide2 = slides [ $that.getTargetIndex ( direction ) ];

		$that.stop ().animate ( { left: 0 }, 300, function () {
			$effectSlide2.css ( { display: 'none' } );
		} );
	},
	getTargetIndex: function ( direction ) {
		var $that = this,
			total = $that.slideTotal,
			curIdx = $that.currentSlideIndex,
			targetIdx;
		if ( direction === 'next' || direction === 1 ) {
			targetIdx = curIdx + 1;
		} else {
			targetIdx = curIdx - 1;
		}
		return ( targetIdx < 0 ) ? total - 1 : targetIdx % total;
	},
	slideSelectHn: function ( e ) {
		e.preventDefault ();
		var $currentTarget = e.data.$currentTarget,
			event = $.Event ( 'itemSelect' );
		event.$currentTarget = $currentTarget;
		event.index = e.index;
		$currentTarget.trigger ( event );
	},
	prevHn: function ( e ) {
		e.preventDefault ();
		var $that = e.data.$delegateTarget;
		switch ( e.type ) {
		    case 'mouseover':
				$that.over ( -1 );
				break;
			case 'mouseout':
				$that.out ( -1 );
				break;
			case 'click':
				$that.prevSlide ();
				break;
		}
	},
	nextHn: function ( e ) {
		e.preventDefault ();
		var $that = e.data.$delegateTarget;
		switch ( e.type ) {
		    case 'mouseover':
				$that.over ( 1 );
				break;
			case 'mouseout':
				$that.out ( 1 );
				break;
			case 'click':
				$that.nextSlide ();
				break;
		}
	},
	enterLeaveHn: function ( e ) {
		var $that = e.data.$delegateTarget;
		if ( e.type === 'mouseenter' ) {
			$that.rollingStop ();
		} else {
			$that.rollingStart ();
		}
	},
	updateCountingHn: function ( e ) {
		var $that = e.data.$currentTarget;
		$that.updateCounting ( e.index );
	}
};

module.exports = CircularRolling;