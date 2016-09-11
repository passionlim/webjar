package cj.oshopping.ecstatic.webjar.taglib.resource;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.*;

import org.junit.Test;

import cj.oshopping.ecstatic.webjar.taglib.resource.HashResourceMatch.JavascriptResourceMatch;
import cj.oshopping.ecstatic.webjar.taglib.resource.HashResourceMatch.OthersResourceResult;

public class HashResourceMatchTest {
	
	String hashText = "0123456789abcdef";
	
	
	@Test
	public void js_pattern_justFile() {
		JavascriptResourceMatch justFileMatch = JavascriptResourceMatch.createIfMatch("common.cjmall.mobile.lib.min.js");
		
		assertTrue(justFileMatch.matches());
		assertThat(justFileMatch.getHashedResource(hashText), is(hashText+"/common.cjmall.mobile.lib.min.js"));
		assertThat(justFileMatch.getJsonFilePath(), is("common.cjmall.mobile.lib.min.js.json"));
	}

	@Test
	public void js_pattern_justFile_forAmdFile() {
		JavascriptResourceMatch justFileMatch = JavascriptResourceMatch.createIfMatch("common.cjmall.mobile.lib.amd.js");
		
		assertTrue(justFileMatch.matches());
		assertThat(justFileMatch.getHashedResource(hashText), is(hashText+"/common.cjmall.mobile.lib.amd.js"));
		assertThat(justFileMatch.getJsonFilePath(), is("common.cjmall.mobile.lib.min.js.json"));
	}
	
	@Test
	public void js_pattern_justFileMatchWithSlash() {
		JavascriptResourceMatch justFileMatchWithSlash = JavascriptResourceMatch.createIfMatch("/common.cjmall.mobile.lib.min.js");
		
		assertTrue(justFileMatchWithSlash.matches());
		assertThat(justFileMatchWithSlash.getHashedResource(hashText), is("/"+hashText+"/common.cjmall.mobile.lib.min.js"));
		assertThat(justFileMatchWithSlash.getJsonFilePath(), is("/common.cjmall.mobile.lib.min.js.json"));
	}
	
	@Test
	public void js_pattern_depth1Match_relative() {
		JavascriptResourceMatch depth1Match = JavascriptResourceMatch.createIfMatch("js/common.cjmall.mobile.lib.min.js");
		
		assertTrue(depth1Match.matches());
		assertThat(depth1Match.getHashedResource(hashText), is("js/"+hashText+"/common.cjmall.mobile.lib.min.js"));
		assertThat(depth1Match.getJsonFilePath(), is("js/common.cjmall.mobile.lib.min.js.json"));
	}

	@Test
	public void js_pattern_depth1Match_absolute() {
		JavascriptResourceMatch depth1Match = JavascriptResourceMatch.createIfMatch("/js/common.cjmall.mobile.lib.min.js");
		
		assertTrue(depth1Match.matches());
		assertThat(depth1Match.getHashedResource(hashText), is("/js/"+hashText+"/common.cjmall.mobile.lib.min.js"));
		assertThat(depth1Match.getJsonFilePath(), is("/js/common.cjmall.mobile.lib.min.js.json"));
	}

	@Test
	public void js_pattern_depth4Match() {
		JavascriptResourceMatch depth4Match = JavascriptResourceMatch.createIfMatch("/dist/common-cjmall-mobile/js/common.cjmall.mobile.lib.min.js");
		
		assertTrue(depth4Match.matches());
		assertThat(depth4Match.getHashedResource(hashText), is("/dist/common-cjmall-mobile/js/"+hashText+"/common.cjmall.mobile.lib.min.js"));
		assertThat(depth4Match.getJsonFilePath(), is("/dist/common-cjmall-mobile/js/common.cjmall.mobile.lib.min.js.json"));
	}
	
	@Test
	public void css_pattern_justFile() {
		OthersResourceResult justFileMatch = OthersResourceResult.createIfMatch("others/css/common.cjmall.mobile.min.css");
		
		assertTrue(justFileMatch.matches());
		assertThat(justFileMatch.getHashedResource(hashText), is("others/"+hashText+"/css/common.cjmall.mobile.min.css"));
		assertThat(justFileMatch.getJsonFilePath(), is("others/others.json"));
	}

	@Test
	public void css_pattern_justFile_absolute() {
		OthersResourceResult justFileMatch = OthersResourceResult.createIfMatch("/others/css/common.cjmall.mobile.min.css");
		
		assertTrue(justFileMatch.matches());
		assertThat(justFileMatch.getHashedResource(hashText), is("/others/"+hashText+"/css/common.cjmall.mobile.min.css"));
		assertThat(justFileMatch.getJsonFilePath(), is("/others/others.json"));
	}

	@Test
	public void css_pattern_justFile_depth4() {
		OthersResourceResult depth4Match = OthersResourceResult.createIfMatch("/dist/common-cjmall-mobile/others/css/common.cjmall.mobile.min.css");
		
		assertTrue(depth4Match.matches());
		assertThat(depth4Match.getHashedResource(hashText), is("/dist/common-cjmall-mobile/others/"+hashText+"/css/common.cjmall.mobile.min.css"));
		assertThat(depth4Match.getJsonFilePath(), is("/dist/common-cjmall-mobile/others/common.cjmall.mobile.others.json"));
	}
	
}
