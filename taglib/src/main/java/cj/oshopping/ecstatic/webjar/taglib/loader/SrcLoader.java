package cj.oshopping.ecstatic.webjar.taglib.loader;

import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.BooleanUtils;

import com.google.common.base.Objects;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import cj.oshopping.ecstatic.webjar.taglib.Phase;
import cj.oshopping.ecstatic.webjar.taglib.config.WebJarConfig;
import cj.oshopping.ecstatic.webjar.taglib.resource.WebJarResource;
import lombok.extern.slf4j.Slf4j;

/**
 * webjar 내에서 baseUrl 하위의 리소스를 로딩하는 클래스이다.
 * 
 * 
 * <pre>
 * {@code
 *          {
 *          	"hash": "b0a2594ef1fb8ae6ccd4dc36a9f3c9ef",
 *          	"timestamp": "2016-08-26T12:01:49.916Z"
 *          }
 * </pre>
 * 
 * <br>
 * 로컬 개발환경일 경우 hash 를 사용하지 않는다. <i>-Dwebjars.{artifactId}.useHash=(true/false)</i>
 * 
 * <p>
 * ex)<br>
 * -Dwebjars.ec-static-common.useHash=false
 * </p>
 * 
 * @author passion
 *
 */
@Slf4j
public class SrcLoader {

	private WebJarConfig config;

	public SrcLoader(WebJarConfig config) {
		this.config = config;
	}

	Cache<String, String> hashedResourceCache = CacheBuilder.newBuilder().maximumSize(10000).build();

	public String load(final Phase phase, final String artifactId, final String src) {
		try {
			return hashedResourceCache.get(getKey(phase, artifactId, src), new Callable<String>() {
				@Override
				public String call() throws Exception {
					return loadInternal(phase, artifactId, src);
				}
			});
		} catch (ExecutionException e) {
			log.warn("fail to load hasehd resource", e);
			return src;
		}
	}

	private String getKey(Phase phase, String artifactId, String src) {
		return "__" + phase + "__" + artifactId + "__" + src;
	}

	private String loadInternal(Phase phase, String artifactId, String src) {
		Boolean useHash = config.getProperty(phase, artifactId, "useHash", Boolean.class);

		if (BooleanUtils.isNotTrue(useHash)) {
			return src;
		}

		WebJarResource resource = WebJarResource.builder()
				.artifactId(artifactId)
				.resource(src)
				.build();

		return resource.getHashedResource();
	}
}
