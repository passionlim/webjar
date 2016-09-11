/**
 * CJmall 모바일 좌측메뉴의 최근본상품모델
 * 
 * @module common/cjmall/ui/m/left/models/recentItemModel
 * 
 */

var Model = Backbone.Model.extend ( {

	defaults: {
		itemCode: '', // 상품코드
		channelCode: '', // 채널코드
		itemImgUrl: '', // 상품이미지URL
		linkUrl: '' // 링크 URL
	}
} );

module.exports = Model;