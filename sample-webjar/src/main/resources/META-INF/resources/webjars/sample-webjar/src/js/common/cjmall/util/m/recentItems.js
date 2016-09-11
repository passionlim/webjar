/**
 * CJmall 최근 본 상품 저장유틸리티
 *
 * @module common/cjmall/util/m/recentItems
 */

var s = this;
var	isInit = false;
var	id = 'UI_HPrd';
var	savedId = '';
var	moCodeImgPath = 'http://image.cjmall.com/cjupload/banner/page/'; // 묶음코드 대표이미지 base url
var	channelCodePre = '5000100'; // 채널코드 base code
var	cjChannelCodePre = '5001400'; // 임직원채널코드 base code
var	cjChannelCodeReg = new RegExp ( cjChannelCodePre + '\\d' );
var	storageMaxNum = 21;
var	expiresDay = 30;
var	subscriberList = [];
var	storage;

function init () {
	isInit = true;
	var data = getData ();
	if (data.isDone) {
		savedId = data.saveId;
		storage = parseStorage (data.items);
	} else {
		storage = [];
	}
	//console.log ( 'saveId : ', savedId, 'storage : ', storage );
	publish ('init');
	
	// popstate가 발생했을때 리스트 다시 가져오기
	$ (window).on ('popstate', function () {
		var refreshedData = getData ();
		if (refreshedData.isDone && refreshedData.savedId !== savedId) {
			savedId = refreshedData.saveId;
			storage = parseStorage (refreshedData.items);
			publish ('update');
		}
	});
}

// 쿠키로부터 데이터 가져오기
function getData () {
	var cookie = Cookies.get ( id );
	var data = {
			isDone: false,
			saveId: '',
			items: []
		};
	
	if (cookie) {
		var parts = cookie.split ('X');
		if (parts.length === 2) {
			data.isDone = true;
			data.saveId = parts [0];
			data.items = parts [1];
		}
	}
	return data;
}

// 아이템리스트 파싱
function parseStorage (data) {
	if (!data) {
		return [];
	}
	
	var retArr = [];
	var items = data.split ('W');
	
	for (var i = 0, len = items.length; i < len; i++) {
		var originData = decompress (items [i]);
		retArr.push (originData);
	}
	return retArr;
}

// 로컬에 저장
function save () {
	var arr = [];
	var time = new Date ().getTime ();
	var savedData = '';
	
	for (var i = 0, len = storage.length; i < len; i++) {
		// 비압축 데이터
		var data = storage [i];
		var compressedData = compress (data);
		
		arr.push (compressedData);
	}
	savedId = toHex (time) + toHex (Math.floor (Math.random () * 10000));
	savedData = savedId + 'X' + arr.join ('W');
	Cookies.set (id, savedData, {expires: expiresDay, domain: 'cjmall.com', path: '/'});
}

function compress (data) {
	// 원본데이터
	var itemCode = data.itemCode;
	var	channelCode = data.channelCode;
	var	moCode = data.moCode;
	var	moCodeImg = data.moCodeImg;
	var	harmGrd = data.harmGrd;
	var	moCodeImgReg;
	
	// 압축데이터
	var cItemCode = toHex (itemCode);
	var	cChannelCode = channelCode.substring (channelCode.length - 1);
	var	cMoCode = '';
	var	cMoCodeImg = '';
	
	// 임직원 채널일경우
	if (cjChannelCodeReg.test (channelCode)) {
		cChannelCode = 'E' + cChannelCode;
	}
	
	// 묶음코드일경우
	if (moCode) {
		moCodeImgReg = new RegExp (moCode + '(\\d*)(?=\\.jpg)');
		cMoCode = toHex (moCode.replace ('M', ''));
		cMoCodeImg = toHex (moCodeImg.match (moCodeImgReg) [1]);
	}
	
	return [cItemCode, cChannelCode, cMoCode, cMoCodeImg, harmGrd].join ('V');
}

function decompress (savedData) {
	var items = savedData.split ('V');
	var	itemCode = toDecimal (items [0]);
	var	channelCode = (/^E/.test (items [1])) ? cjChannelCodePre + items [1].replace (/^E/, '') : channelCodePre + items [1];
	var	moCode = (items [2] !== '') ? 'M' + toDecimal (items [2]) : '';
	var	moCodeImg = (items [3] !== '' && moCode !== '') ? moCodeImgPath + moCode + toDecimal (items [3] ) + '.jpg': '';
	var	harmGrd = items [4];
	
	return {
		itemCode: itemCode,
		channelCode: channelCode,
		moCode: moCode,
		moCodeImg: moCodeImg,
		harmGrd: harmGrd
	};
}

// 변경사항 발행
function publish (message) {
	for (var i = 0, len = subscriberList.length; i < len; i++) {
		var subscriberInfo = subscriberList [ i ];
		var	context = subscriberInfo.context;
		var	callback = subscriberInfo.callback;
		
		callback.apply (context, [message]);
	}
}

// 구독자등록
function subcribe (context, callback) {
	subscriberList.push ({context: context, callback: callback});
	if (isInit) {
		setTimeout (function () {
			callback.apply (context, ['init']);
		}, 1);
	}
}

// 아이템 추가
function add (itemCode, channelCode, moCode, moCodeImg, harmGrd) {
	var data = {
			itemCode: (typeof itemCode === 'number') ? '' + itemCode : itemCode,
			channelCode: (typeof channelCode === 'number') ? '' + channelCode : channelCode,
			moCode: moCode,
			moCodeImg: moCodeImg,
			harmGrd: harmGrd
		};
	var dupIdx = -1;
	
	for (var i = 0, len = storage.length; i < len; i++) {
		var v = storage [i];
		if (itemCode === v.itemCode && channelCode === v.channelCode) {
			dupIdx = i;
		}
	}
	
	if (dupIdx >= 0) {
		storage.splice (dupIdx, 1);
	}
	storage.unshift (data);
	if (storage.length > storageMaxNum) {
		storage = storage.slice (0, storageMaxNum);
	}
	save ();
	
	return data;
}

function toHex (num) {
	var retVal = false;
	switch (typeof num) {
		case 'string':
			if (/\d*/.test (num)) {
				retVal = parseInt (num, 10).toString (36);
			}
			break;
		case 'number':
			retVal = parseInt (num, 10).toString (36);
			break;
	}
	return retVal;
}

function toDecimal (hex) {
	var retVal = false;
	switch (typeof hex) {
		case 'number':
			retVal = hex.toString ();
			break;
		case 'string':
			try {
				retVal = parseInt (hex, 36).toString ();
			} catch (err) {
			
			}
			break;
	}
	return retVal;
}

// 아이템 조회
function gets (cnt) {
	var arr;
	if (cnt) {
		arr = storage.slice (0, cnt);
	} else {
		arr = storage.slice (0, storage.length);
	}
	return arr;
}

// 아이템 삭제
function remove (itemCode, channelCode) {
	var removed = false;
	for (var i = 0, len = storage.length; i < len; i++) {
		var item = storage [ i ];
		if (itemCode === item.itemCode && channelCode === item.channelCode) {
			storage.splice (i, 1);
			removed = true;
			break;
		}
	}
	save ();
	publish ('remove');
}

// 아이템 전체삭제
function removeAll () {
	storage = [];
	save ();
	publish ('removeAll');
}

init ();

module.exports = {
	/** 구독자등록 */
	subcribe: subcribe,
	/** 아이템 추가 */
	add: add,
	/**  아이템 삭제 */
	remove: remove,
	/** 아이템 전체삭제 */
	removeAll: removeAll,
	/** 아이템 조회 */
	gets: gets
};