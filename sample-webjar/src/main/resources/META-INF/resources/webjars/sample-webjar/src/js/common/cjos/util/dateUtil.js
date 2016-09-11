/**
 * 날짜관련 유틸
 * 
 * @module common/cjos/util/dateUtil
 */

//달, 요일, 오전/오후를 표시하는 문자열
var names = {
	month   : ['January', 'Febrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December'],
	s_month : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	day     : ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	day_kr  : ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
	s_day   : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	s_day_kr: ['일', '월', '화', '수', '목', '금', '토'],
	ampm    : ['AM', 'PM'],
	ampm_kr : ['오전', '오후']
};

module.exports = {
	/**
	 * format Date객체를 지정한 형식 문자열에 맞춰 변형
	 * 
	 * @param {Date} timestamp Date객체 or Date객체 생성을 위한 문자열
	 * @param {String} formatStr 형식문자열
	 * @returns {String} 변환된 문자열
	 * @example
	 *  [포맷문자열]
	 *  = 날짜 =
	 *  d : 두자리 날자 ( 01 ~ 31 )
	 *  j : 0 없는 날짜 ( 1 ~ 31 )
	 *  l : 주의 전체날짜 ( names.day에 지정된 날짜 )
	 *  D : 요약된 날짜 ( names.s_day에 지정된 날짜 )
	 *  w : 그 주의 몇번째 일 ( 0(일) ~ 6(토) )
	 *  N : ISO-8601 주의 몇번째 일 ( 1(월) ~ 7(일) )
	 *  k : 한글로된 주의 전체날짜 ( names.day_kr에 지정된 날짜 )
	 *  K : 한글로된 요약된 날짜 ( names.s_day_kr에 지정된 날짜 )
	 *  = 월 =
	 *  m : 두자리 고정인 월 ( 01 ~ 12 )
	 *  n : 0없는 월 ( 1 ~ 12 )
	 *  F : 월의 문자열 이름
	 *  M : 축약된 월의 문자열 이름
	 *  = 년 =
	 *  Y : 4자리 연도 ( 2015 )
	 *  y : 2자리 연도 ( 15 )
	 *  = 시분초 =
	 *  a : 소문자 오전, 오후 ( am, pm )
	 *  A : 대문자 오전, 오후 ( AM, PM )
	 *  p : 한글 오전, 오후
	 *  g : (12시간 주기) 0없는 두자리 시간 ( 1 ~ 12 )
	 *  G : (24시간 주기) 0없는 두자리 시간 ( 1 ~ 12 )
	 *  h : (12시간 주기) 0있는 두자리 시간.( 01 ~ 12 )
	 *  H : (24시간 주기) 0있는 두자리 시간.( 00 ~ 24 )
	 *  i : 0있는 두자리의 분
	 *  s : 0포함 두자리의 초
	 *  u : milliseconds.
	 */
	format: function (formatStr, timestamp) {
		var o = {};
		var date;
		
		if (timestamp) {
			date = (timestamp instanceof Date) ? timestamp : new Date (timestamp);
		} else {
			date = new Date ();
		}
		
		return (formatStr || '').replace (/[a-z]/ig, function (m) {
			if (typeof o [m] !== 'undefined') {
				return o [m];
			}
		
			switch (m) {
				case 'd':
				case 'j':
					o.j = date.getDate ();
					o.d = (o.j > 9 ? '' : '0') + o.j;
					return o [m];
				case 'l':
				case 'D':
				case 'w':
				case 'N':
				case 'K':
				case 'k':
					o.w = date.getDay ();
					o.N = o.w ? o.w : 7;
					o.D = names.s_day [o.w];
					o.l = names.day [o.w];
					o.K = names.s_day_kr [o.w];
					o.k = names.day_kr [o.w];
					return o [m];
				case 'm':
				case 'n':
					o.n = date.getMonth () + 1;
					o.m = (o.n > 9 ? '' : '0') + o.n;
					return o [m];
				case 'F':
				case 'M':
					o [m] = names [m === 'F' ? 'month' : 's_month'] [d.getMonth ()];
					return o [m];
				case 'Y':
				case 'y':
					o.o = o.Y = date.getFullYear ();
					o.y = (o.o + '').substr (2);
					return o [m];
				case 'a':
				case 'A':
				case 'p':
				case 'g':
				case 'G':
				case 'h':
				case 'H':
					o.G = date.getHours ();
					o.g = (o.g = o.G % 12) ? o.g : 12;
					o.A = o.G < 12 ? names.ampm [0] : names.ampm [1];
					o.a = o.A.toLowerCase ();
					o.p = o.G < 12 ? names.ampm_kr [0] : names.ampm_kr [1];
					o.H = (o.G > 9 ? '' : '0') + o.G;
					o.h = (o.g > 9 ? '' : '0') + o.g;
					return o [m];
				case 'i':
					o.i = (((o.i = date.getMinutes ()) > 9) ? '': '0') + o.i;
					return o.i;
				case 's':
					o.s = (((o.s = date.getSeconds () ) > 9) ? '': '0') + o.s;
					return o.s;
				case 'u':
					o.u = date.getMilliseconds ();
					return o.u;
				default:
					return m;
			}
		});
	},

	/**
	 * 문자열 날짜 format이 "20151007124000(년도.월.일.시간.분.초)" 인 경우를 Date 타입으로 형변환 한다.
	 * 
	 * @param {String} str 형식문자열
	 * @returns {Date} 변환된 Date객체
	 */
	getDateFromString: function (str) {
		if (/\d{14}/.test (str)) {
			var year = str.substring (0, 4);
			var month = str.substring (4, 6) - 1; // month 는 0이 1월 이므로 -1 을 해준다.
			var day = str.substring (6, 8);
			var hour = str.substring (8, 10);
			var minute = str.substring (10, 12);
			var second 	= str.substring (12, 14);
		
			return new Date (year, month, day, hour, minute, second);
		} else {
			//return new Error ('[invalid params] str');
			return;
		}
	},

	/**
	 * 밀리 초 단위의 TimeStamp 정수값을 Date 객체로 형변환
	 * 
	 * @param {*} timestamp Date객체 or Date객체 생성을 위한 문자열
	 * @returns {Date} 변환된 Date객체
	 */
	getDateFromTimestamp: function (timestamp) {
		if (typeof timestamp === 'number') {
			return new Date (timestamp);
		} else if (typeof timestamp === 'string' && /\d*/.test (timestamp)) {
			return new Date (parseInt (timestamp));
		}
	}
};

