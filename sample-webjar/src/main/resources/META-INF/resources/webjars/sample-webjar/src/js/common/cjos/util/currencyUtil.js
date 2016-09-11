/**
 * 통화관련 유틸
 *
 * @module common/cjos/util/currencyUtil
 */

module.exports = {
	/**
	 * value값을 통화형태표현 (세 자릿수마다 콤마(,) 붙이기)
	 *
	 * @param {Number} value 변환할 값
	 * @returns {String} 해당포맷으로 변환된 문자열
	 */		
	formatNumber: function (value) {
		var s = this;
		var number = s.unformat (value);
		
		if (_.isUndefined (number)) {
			return value;
		}

		var	nagative = (number < 0) ? '-' : '';
		var natural = parseInt (Math.abs (number)).toString ();
		var start = (natural.length > 3) ? natural.length % 3 : 0;
		var decimal = ('' + value).split ('.') [1];
		var result = nagative + ((start !== 0) ? natural.substr (0, start) + ',' : '') + natural.substr (start).replace (/(\d{3})(?=\d)/g, '$1,') + (decimal ? '.' + decimal : '');
		
		return result;
	},
	
	/**
	 * 숫자로 변환. 변환가능한 타입이 아닐때에는 undefined 반환
	 *
	 * @param {Number} value 변환할 값
	 * @returns {Number} 변환된 숫자
	 */
	unformat: function (value) {
		if (typeof value === 'number') {
			return value;
		} else if (typeof value === 'string' && value !== '') {
			if (/[^0-9-.,]/g.test (value)) {
				return;
			} else {
				return parseFloat (value.replace (/[^0-9-.]/g, ''));
			}
		}
		return;
	}
};
