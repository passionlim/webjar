/**
 * CJmall 좌측메뉴 카테고리 컬렉션
 * 
 * @modules common/cjmall/ui/m/left/collections/categoryCollection
 * 
 * @requires module:common/cjos/util/commonUtil
 * @requires module:common/cjos/util/jspVariables
 * @requires module:common/cjos/util/urlUtil
 * @requires module:common/cjmall/ui/m/left/models/categoryModel
 */
// import
var commonUtil		= require ('common/cjos/util/commonUtil');
var jspVariables	= require ('common/cjos/util/jspVariables');
var urlUtil			= require ('common/cjos/util/urlUtil');
var CategoryModel	= require ('common/cjmall/ui/m/left/models/categoryModel');

// collections
var Collection = Backbone.Collection.extend ({
	
	model: CategoryModel,
	defaultAndParamObj: null,
	rootCtgList: {
		result: {
			rootCtgList: [
			 	{ctgId: '14', seq: '1',  pic: 'fashion', ctgName: '패션/언더웨어'},
				{ctgId: '15', seq: '2',  pic: 'sports', ctgName: '잡화/스포츠'},
				{ctgId: '16', seq: '3',  pic: 'beauty', ctgName: '뷰티/보석'},
				{ctgId: '17', seq: '4',  pic: 'food', ctgName: '식품/주방'},
				{ctgId: '19', seq: '5',  pic: 'living', ctgName: '인테리어/리빙'},
				{ctgId: '18', seq: '6',  pic: 'baby', ctgName: '유아동/도서'},
				{ctgId: '20', seq: '7',  pic: 'digital', ctgName: '디지털/여행'},
				{ctgId: null, seq: null, pic: 'insurance', ctgName: '보험/금융'},
				{ctgId: '21', seq: '10', pic: 'tvshopping',   ctgName: 'TV쇼핑'},
				{ctgId: '13', seq: '11', pic: 'department', ctgName: '백화점'}
			]
		},
		code: 1
	},
	
	initialize: function () {
		var s = this;
		s.defaultAndParamObj = urlUtil.queryToHash (jspVariables.get ('defaultAndParam'));
	},
	
	validate: function (data) {
		if (!data || data.code === 0) {
			return false;
		}
		
		if (!data.result || !data.result.rootCtgList) {
			return false;
		}
	
		return true;
	},
	
	update: function () {
		var s = this;
		
		s.reset ();
		
		var data = s.rootCtgList;
		var	mobileUrl = jspVariables.get ('mobileUrl');
		var	insuMobileUrl = 'http://' + jspVariables.get ('insuMobileUrl');
		var	baseURL = mobileUrl + '/m/category/main.jsp';
		var	paramObj = s.defaultAndParamObj;
		var	rootCtgList = data.result.rootCtgList;
		var	modelArr = [];
	
		for (var i = 0, len = rootCtgList.length; i < len; i++) {
			var ctg = rootCtgList [i];
			var	ctgId = ctg.ctgId;
			var	ctgName = ctg.ctgName;
			var	pic = ctg.pic;
			var	seq = ctg.seq;
			var	linkURL = '';
			var	className = '';
			var	inParams = _.clone (paramObj);
			var	model;
			
			switch (ctgName) {
				case '보험/금융':
					className = 'ctg_insu';
					inParams.pic = pic;
					linkURL = insuMobileUrl + '/m/main.jsp';
					break;
				default:
					inParams.pctgId = ctgId;
					inParams.pic = pic;
					inParams.seq = seq;
					inParams.title = ctgName;
					linkURL = baseURL;
					className = 'ctgId_' + ctgId;
			}
			
			linkURL = (linkURL) ? urlUtil.setParamsToURLString (linkURL, inParams) : '';
			
			model = new CategoryModel ({
				ctgId: ctgId,
				ctgName: ctgName,
				pic: pic,
				linkURL: linkURL,
				className: className
			});
			modelArr.push (model);
		}
		s.add (modelArr);
	}
});

module.exports = commonUtil.getSingleton (Collection);