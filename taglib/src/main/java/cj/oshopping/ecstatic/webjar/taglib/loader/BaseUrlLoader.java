package cj.oshopping.ecstatic.webjar.taglib.loader;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.util.Properties;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;

import javax.servlet.ServletContext;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import cj.oshopping.ecstatic.webjar.taglib.Phase;
import cj.oshopping.ecstatic.webjar.taglib.config.WebJarConfig;

/**
 * 설정된 Target 정보의 url.properties 에서 default host 설정을 얻는 함수.
 * 
 * <p>
 * 설정된 값은 System Property 를 먼저 찾고 그 값이 없으면 Classpath 에서
 * /META-INF/resources/{artifactId}/url.properties 를 찾아 해당 정보를 찾는다.<br>
 * property 값은 {phase}.baseUrl / {phase}.baseUrl.ssl 값으로 찾는다.
 * </p>
 * 
 * <p>
 * 아래는 ec-static-common 의 url.properties 예시이다. 맞는 phase 값이 없으면 default 를 사용한다.
 * 
 * <pre>
 * # setting for webjar tablib 
 * default.baseUrl=http://dev-image.cjmall.net/static/ec-static-common/
 * default.baseUrl.ssl=https://dev-image.cjmall.net/static/ec-static-common/
 * dev.baseUrl=http://dev-image.cjmall.net/static/ec-static-common/
 * dev.baseUrl.ssl=https://dev-image.cjmall.net/static/ec-static-common/
 * qa.baseUrl=http://dev-image.cjmall.net/static/ec-static-common/
 * qa.baseUrl.ssl=https://dev-image.cjmall.net/static/ec-static-common/
 * staging.baseUrl=http://image.cjmall.net/static/ec-static-common/
 * staging.baseUrl.ssl=https://image.cjmall.net/static/ec-static-common/
 * prod.baseUrl=http://image.cjmall.net/static/ec-static-common/
 * prod.baseUrl.ssl=https://image.cjmall.net/static/ec-static-common/
 * </pre>
 * </p>
 * 
 * <br>
 * webjar에 설정된 내용을 사용하지 않으려면 로컬 개발환경일 경우 다음과 같이 System Property 설정을 통해 도메인 정보를
 * 설정하지 않고 사용할 수 있다.<br>
 * <i>-Dwebjars.{artifactId}.baseUrl={urlPrefix}</i>
 * 
 * <p>
 * ex)<br>
 * -Dwebjars.ec-static-common.baseUrl=http://localhost:8080/webjars/ec-static-common
 * -Dwebjars.ec-static-common.ssl.baseUrl=https://localhost:8443/webjars/ec-static-common
 * </p>
 * 
 * @author passion
 */
public class BaseUrlLoader {
	private WebJarConfig config;

	public BaseUrlLoader(WebJarConfig config) {
		this.config = config;
	}
	
	public String load(Phase phase, final String artifactId, boolean secureProtocol) {
		String baseUrlKey = secureProtocol ? "baseSslUrl" : "baseUrl";
		return config.getProperty(phase, artifactId, baseUrlKey, String.class);
	}

}
