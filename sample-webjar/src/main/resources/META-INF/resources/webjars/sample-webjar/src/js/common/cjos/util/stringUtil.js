/**
 * 문자열 변환 및 삭제 관련 유틸
 *
 * @module common/cjos/util/stringUtil
 */

module.exports = {
	/**
	 * 주어진 문자열에 대해서 html escape를 수행한다
	 *
	 * @param {String} str HTML형식의 문자열
	 * @returns {String} escape된 문자열
	 */
	escapeHtml: function (str) {
		if (typeof str !== 'string') {
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
		
		return String (str).replace (/[&<>"'\/]/g, function (s) {
			return ENTITY_MAP [s];
		});
	},
	
	/**
	 * 주어진 문자열에 포함되어 있는 개행문자를 <br>로 치환하여 리턴한다
	 *
	 * @param {String} str 개행할 문자열
	 * @returns {String} 변환이 완료된 문자열
	 */
	replaceCrToBrTag: function (str) {
		return (str && typeof str === 'string') ? str.replace (/(\r\n|\n|\r)/g, '<br />') : '';
	},
	
	/**
	 * HTML태그 삭제
	 *
	 * @param {String} str 편집할 문자열
	 * @returns {String} HTML태그가 삭제된 문자열
	 */
	removeHtmlTag: function (str) {
		return (str && typeof str === 'string') ? str.replace (/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/gi, '') : '';
	},
	
	/**
	 * 특수문자 삭제
	 *
	 * @param {String} str 편집할 문자열
	 * @returns {String} 특수문자가 삭제된 문자열
	 */
	removeSpecialChar: function (str) {
		return (str && typeof str === 'string') ? str.replace (/[\{\}\[\]\/!?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '') : '';
	}
};