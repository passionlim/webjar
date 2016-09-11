/**
 * 타입체크 유틸 (되도록이면 underscore.js에 확인해보고 없으면 추가할 것)
 *
 * @module common/cjos/util/typeCheckUtil
 */

module.exports = {
	/**
	 * 파라미터가 Numeric인지 체크
	 *
	 * @param {*} num 체크할 오브젝트
	 * @returns {Boolean}
	 */
	isNumeric: function (num) {
		return !isNaN (parseFloat (num)) && !_.isArray (num) && isFinite (num);
	}
};