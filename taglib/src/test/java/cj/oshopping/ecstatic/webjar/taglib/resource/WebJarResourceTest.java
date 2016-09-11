package cj.oshopping.ecstatic.webjar.taglib.resource;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.*;

import java.io.Reader;
import java.util.Map;

import org.junit.Test;

public class WebJarResourceTest {

	@Test
	public void sample_webjar에서_js파일에매치되는_hash_json파일찾기() {
		WebJarResource resource = 
				WebJarResource.builder()
					.artifactId("sample-webjar")
					.resource("/dist/common-cjmall-mobile/js/common.cjmall.mobile.lib.min.js")
					.build();
		
		String contents = resource.readerFileContents(resource.getHashFilePath());
		assertThat(contents, notNullValue());
		
		Map<String, Object> map = resource.parseJsonHashFile();
		
		assertThat(map.get("hash"), notNullValue());
		assertTrue(map.get("hash").toString().trim().length() > 0);
	}
	
	@Test
	public void sample_webjar에서_css파일에매치되는_hash_json파일찾기() {
		WebJarResource resource = 
				WebJarResource.builder()
					.artifactId("sample-webjar")
					.resource("/dist/common-cjmall-mobile/others/css/common.cjmall.mobile.min.css")
					.build();
		
		String contents = resource.readerFileContents(resource.getHashFilePath());
		assertThat(contents, notNullValue());
		
		Map<String, Object> map = resource.parseJsonHashFile();
		
		assertThat(map.get("hash"), notNullValue());
		assertTrue(map.get("hash").toString().trim().length() > 0);
	}

	

}
