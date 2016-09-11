package cj.oshopping.ecstatic.webjar.taglib.config;

import java.io.Reader;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;

import org.apache.commons.lang3.BooleanUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import cj.oshopping.ecstatic.webjar.taglib.Phase;
import cj.oshopping.ecstatic.webjar.taglib.resource.WebJarResource;

/**
 * 
 * Webjar 내에 있는 url.properties 에 대한 속성 및 System Property 에 있는 속성을 읽어주는 WebJar 용 Config Class
 * 
 * <p>
 * 우선순위는 다음 순에 따른다.
 * <ul>
 * <li>SystemProperty에 있는 속성</li>
 * <li>url.properties 에 phase 에 맞는 속성</li>
 * <li>url.properties 에 default 로 선언된</li>
 * </p>
 * 
 * <p>
 * SystemProperty 는 다음과 같이 설정한다. -Dwebjar.{artifactId}.{key}=value
 * 
 * <pre>
 * ex) ec-static 로컬개발 담당자 System Property 설정
 * -Dwebjars.ec-static-common.baseUrl=http://localhost:8080/webjars/ec-static-common
 * -Dwebjars.ec-static-common.baseUrl.ssl=http://localhost:8443/webjars/ec-static-common
 * -Dwebjars.ec-static-common.useHash=false
 * </pre>
 * 
 * <p>
 * properties 속성 정의는 다음과 같다.
 * </p>
 * 
 * <pre>
 * # setting for webjar tablib
 * default.baseUrl=http://dev-image.cjmall.net/static/ec-static-common/
 * default.baseUrl.ssl=https://dev-image.cjmall.net/static/ec-static-common/
 * default.useHash=true local.useHash=false
 * 
 * staging.baseUrl=http://image.cjmall.net/static/ec-static-common/
 * staging.baseUrl.ssl=https://image.cjmall.net/static/ec-static-common/
 * 
 * prod.baseUrl=http://image.cjmall.net/static/ec-static-common/
 * prod.baseUrl.ssl=https://image.cjmall.net/static/ec-static-common/
 * </pre>
 * 
 * @author passion
 *
 */
public class WebJarConfig {
	private static final String CONFIG_JSON_FILE = "url.json";
	public static final String SYSTEM_PROPERTY_KEY_PREFIX = "webjars";

	/**
	 * Artifact별로 Properties 를 캐싱
	 */
	private Cache<String, Map<String, Object>> urlPropertiesCache = CacheBuilder.newBuilder()
			.maximumSize(5000)
			.build();

	public String getSystemProperty(String artifactId, String key) {
		String systemPropertyValue = System.getProperty(SYSTEM_PROPERTY_KEY_PREFIX + artifactId + "." + key);

		if (systemPropertyValue != null) {
			return systemPropertyValue;
		}

		return key;
	}

	@SuppressWarnings("unchecked")
	public <T> T getProperty(Phase phase, final String artifactId, String key, Class<T> clazz) {
		return (T) this.getProperty(phase, artifactId, key);
	}

	public Object getProperty(Phase phase, final String artifactId, String key) {

		String systemPropertyValue = System.getProperty(SYSTEM_PROPERTY_KEY_PREFIX + "." + artifactId + "." + key);

		if (systemPropertyValue != null) {
			return systemPropertyValue;
		}

		Map<String, Object> properties;
		try {
			properties = urlPropertiesCache.get(artifactId, new Callable<Map<String, Object>>() {
				@Override
				public Map<String, Object> call() throws Exception {
					return loadUrlConfig(artifactId);
				}
			});
		} catch (ExecutionException e) {
			throw new IllegalArgumentException("fail to load properties ", e);
		}

		Map<String, Object> currentPhaseProperty = getPhaseProperty(properties, phase != null ? phase.name() : null);

		if (currentPhaseProperty != null && BooleanUtils.isNotFalse((Boolean) currentPhaseProperty.get("activated"))) {
			Object value = currentPhaseProperty.get(key);
			if (value != null) {
				return value;
			}
		}

		Map<String, Object> defaultProperty = getPhaseProperty(properties, "default");

		if (defaultProperty != null) {
			Object value = defaultProperty.get(key);
			if (value != null) {
				return value;
			}
		}

		throw new IllegalArgumentException("cannot find a property[artifactId: " + artifactId + " key: " + key + "]");
	}

	@SuppressWarnings("unchecked")
	private Map<String, Object> getPhaseProperty(Map<String, Object> properties, String phase) {
		if (phase == null) {
			return null;
		}

		return (Map<String, Object>) properties.get(phase);
	}

	private static ObjectMapper objectMapper = new ObjectMapper();

	public Map<String, Object> loadUrlConfig(String artifactId) {
		WebJarResource resource = WebJarResource.builder()
				.artifactId(artifactId)
				.build();

		String resourcePath = resource.getClassPathRelativePath(CONFIG_JSON_FILE);
		String configJsonContents = resource.readerFileContents(CONFIG_JSON_FILE);

		if (configJsonContents == null) {
			throw new IllegalArgumentException("Cannot found resource to load json config. " + resourcePath);
		}

		try {
			return objectMapper.readValue(configJsonContents, new TypeReference<HashMap<String, Object>>() {
			});
		} catch (Exception e) {
			throw new IllegalArgumentException("fail to load a config from " + resourcePath, e);
		}
	}

}
