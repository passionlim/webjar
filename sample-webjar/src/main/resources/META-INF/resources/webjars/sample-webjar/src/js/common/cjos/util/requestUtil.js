/**
 * 페이지이동 관련유틸
 *
 * @module common/cjos/util/requestUtil
 */

module.exports = {
	/**
	 * 페이지이동 ( 새창 or 현재창 )
	 *
	 * @param {String} linkURL 페이지이동주소
	 * @param {Boolean} isOpener 새창으로 띄울지 여부 ( true: 새창, false: 현재창 )
	 */
	navigateToURL: function (linkURL, isOpener) {
		if (isOpener) {
			window.open (linkURL, '');
		} else {
			location.href = linkURL;
		}
	}
};