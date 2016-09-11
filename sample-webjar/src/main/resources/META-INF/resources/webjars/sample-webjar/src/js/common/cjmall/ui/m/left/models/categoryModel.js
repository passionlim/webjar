/**
 * CJmall 좌측메뉴 카테고리 모델
 * 
 * @modules common/cjmall/ui/m/left/models/categoryModel
 */

var Model = Backbone.Model.extend ({
	
	defaults: {
		ctgId: 0,
		ctgName: '', // 카테고리명
		pic: '', // 스플렁크 pic
		linkURL: '', // 링크
		className: '' // CSS클래스명
	}
});

module.exports = Model;