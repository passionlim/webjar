/**
 * CJmall 모바일 > 메인 헤더모델
 * 
 * @module common/cjmall/ui/m/header/models/mainHeaderModel
 */

// model
var Model = Backbone.Model.extend ({
	
	defaults: {
		index: 0,
		title: '', // 메뉴명
		flag: null, // 플래그 ( null: 없음, new: new플래그 )
		linkURL: '', // 메뉴링크
		code: '', // 구분코드 (01 : 오클락딜(메인), 02 : TV쇼핑, 03 : 이벤트, 04 : 백화점, 05 : 기획전, 20 : 테마)
		type: '',
		isOn: false
	}
});

module.exports = Model;