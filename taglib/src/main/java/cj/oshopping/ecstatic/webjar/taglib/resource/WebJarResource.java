package cj.oshopping.ecstatic.webjar.taglib.resource;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.springframework.util.ClassUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import ch.qos.logback.classic.Logger;
import cj.oshopping.ecstatic.webjar.taglib.resource.HashResourceMatch.JavascriptResourceMatch;
import cj.oshopping.ecstatic.webjar.taglib.resource.HashResourceMatch.OthersResourceResult;
import lombok.AccessLevel;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * WebJar내 있는 리소스를 관리하는 Class
 * 
 * WebJar 내에 있는 정적 자원들은 읽을 수 있는 일부 Util Class 를 제공한다. {@link #readerFileContents()}
 * 
 * {@link #getHashedResource()}의 경우 hash된 자원으로 판단되는 경우 URL 에 hash 를 붙여주는 기능을 한다.
 * 
 * hash 를 붙이는 기준은 다음과 같다.
 * 
 * <ul>
 * <li>/others/ 디렉토리 하위의 정적자원(css, image, html)등은 하나의 others 상위 디렉토리로 hash를 붙이다..</li>
 * <li>/js 하위의 js 파일은 각 파일이 hash 단위가 된다. js 상위 디렉토리에 hash를 붙인다.</li>
 * </ul>
 * 
 * js 파일은 해당 리소스의 파일과 동일한 위치에 존재하고 others 의 경우는 others 디렉토리 하위에 위치한다.
 * 
 * 
 * @author passion
 *
 */
@Slf4j
public class WebJarResource {
	private static final String WEBJAR_DIRECTORY_BASE = "/META-INF/resources";

	/**
	 * artifactId
	 */
	String artifactId;

	/**
	 * artifact 하위 리소스 상대경로
	 */
	String resource;

	/**
	 * hash directory 지원 패턴
	 */
	@Setter(value = AccessLevel.NONE)
	private HashResourceMatch hashResourceMatch;

	/**
	 * 해당 자원이 위치한 hash directory 이름
	 */
	@Setter(value = AccessLevel.NONE)
	private String hash;

	/**
	 * Json Parser
	 */
	private static ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * Builder
	 * 
	 * @author passion
	 *
	 */
	public static class WebJarResourceBuilder {
		String artifactId;
		String resource;

		public WebJarResourceBuilder artifactId(String artifactId) {
			this.artifactId = artifactId;
			return this;
		}

		public WebJarResourceBuilder resource(String resource) {
			this.resource = resource;
			return this;
		}

		public WebJarResource build() {
			WebJarResource result = new WebJarResource();
			result.artifactId = artifactId;
			result.resource = resource;

			return result;
		}
	}

	public static WebJarResourceBuilder builder() {
		return new WebJarResourceBuilder();
	}

	/**
	 * 설정된 WebjarResource 의 InputStream 을 얻는 함수
	 * 
	 * @return 읽혀진 InputStream 하지만
	 */
	public Reader getReader() {
		return this.getReader(resource);
	}

	/**
	 * 리소스 하위 정보를 조회하는 함수
	 * 
	 * @param resource
	 * @return
	 */
	public Reader getReader(String resource) {
		String resourcePath = getClassPathRelativePath(resource);
		try {
			InputStream inputStream = getClass().getClassLoader().getResourceAsStream(resourcePath);
			if (inputStream == null) {
				return null;
			}
			return new InputStreamReader(inputStream, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			log.warn("fail to decode input stream in UTF-8", e);
			return new InputStreamReader(this.getClass().getClassLoader().getResourceAsStream(resourcePath));
		}
	}

	
	public static ClassLoader getDefaultClassLoader() {
		ClassLoader cl = null;
		try {
			cl = Thread.currentThread().getContextClassLoader();
		} catch (Throwable ex) {
			// Cannot access thread context ClassLoader - falling back...
		}

		if (cl == null) {
			// No thread context class loader -> use class loader of this class.
			cl = ClassUtils.class.getClassLoader();
			if (cl == null) {
				// getClassLoader() returning null indicates the bootstrap ClassLoader
				try {
					cl = ClassLoader.getSystemClassLoader();
				} catch (Throwable ex) {
					// Cannot access system ClassLoader - oh well, maybe the caller can live with null...
				}
			}
		}
		return cl;
	}

	public void closeQuietly(Reader reader) {
		if (reader != null) {
			try {
				reader.close();
			} catch (IOException e) {
				log.error("fail to close reader", e);
			}
		}

	}

	/**
	 * ClassPath 기준의 상대경로를 구해주는 함수 /META-INF/resource 를 포함한 webjar 상대경로를 구해주는 함수
	 * 
	 * @param resource
	 * @return
	 */
	public String getClassPathRelativePath(String resource) {
		StringBuilder classPathRealativePath = new StringBuilder(200);
		classPathRealativePath.append(WEBJAR_DIRECTORY_BASE).append("/").append("webjars").append("/").append(artifactId);

		if (!resource.startsWith("/")) {
			classPathRealativePath.append("/");
		}
		classPathRealativePath.append(resource);

		if (classPathRealativePath.charAt(0) == '/') {
			return classPathRealativePath.substring(1);
		} else {
			return classPathRealativePath.toString();
		}
	}

	/**
	 * 현재 Resource 에 Hash 가 정의된 파일의 json 내용을 Map 으로 파싱해주는 함수
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> parseJsonHashFile() {
		String filePath = this.getHashFilePath();
		try {
			String fileContents = readerFileContents(this.getHashFilePath());
			
			if ( fileContents == null ) {
				return Collections.emptyMap();
			}
			
			if(log.isDebugEnabled()) {
				log.debug("["+filePath + "]:"+ fileContents);
			}
			
			Map<String, Object> result = objectMapper.readValue(fileContents, HashMap.class);

			if (result == null || result.get("hash") == null) {
				log.warn("fail to load hash from config [ filePath: " + filePath + " ]");
			}

			return result;
		} catch (Exception e) {
			log.error("fail to parse json." + filePath, e);
			return Collections.emptyMap();
		}
	}

	/**
	 * Webjar 내 파일에 내용을 읽어 주는 함수 
	 * 읽는 Encoding 은 UTF-8 로 읽는다.
	 * @param resource
	 * @return
	 */
	public String readerFileContents(String resource) {
		return this.readerFileContents(resource, "UTF-8");
	}
	
	public String readerFileContents(String resource, String encoding) {
		String classPathResource = this.getClassPathRelativePath(resource);
		try {
			return IOUtils.toString(this.getClass().getClassLoader().getResource(classPathResource), encoding);
		} catch (IOException e) {
			log.error("file does not exist." + classPathResource);
		}
		
		return null;
	}

	/**
	 * MatchResult 를 리턴해 주는 함수 생성한 적이 없으면 Others / Javascript 패턴을 확인해 결과를 리턴함
	 * 
	 * @return
	 */
	public HashResourceMatch getHashResourceMatch() {
		if (this.hashResourceMatch != null) {
			return hashResourceMatch;
		}

		hashResourceMatch = OthersResourceResult.createIfMatch(resource);

		if (hashResourceMatch != null) {
			return hashResourceMatch;
		}

		hashResourceMatch = JavascriptResourceMatch.createIfMatch(resource);

		if (hashResourceMatch != null) {
			return hashResourceMatch;
		}

		return null;
	}

	/**
	 * 해당 리소스 파일의 적용된 hash 파일을 찾는 함수.
	 * 
	 * others 하위의 image/css 의 경우는 others 하위에 모듈명.json 파일에 hash 존재 그외 js 의 경우는 min 파일 하위로 존재
	 * 
	 * @param src
	 * @return
	 */
	public String getHashFilePath() {
		HashResourceMatch hashResourceMatch = this.getHashResourceMatch();
		if (hashResourceMatch != null && hashResourceMatch.matches()) {
			return hashResourceMatch.getJsonFilePath();
		}

		return null;
	}

	/**
	 * Hash Directory를 추가한 Resource 경로를 리턴해주는 함수
	 * 
	 * @return
	 */
	public String getHashedResource() {
		HashResourceMatch hashResourceMatch = this.getHashResourceMatch();
		if (hashResourceMatch != null && hashResourceMatch.matches()) {
			return hashResourceMatch.getHashedResource(getHash());
		}

		return null;
	}

	private String getHash() {
		if (this.hash != null) {
			return null;
		}

		Map<String, Object> parsedMap = this.parseJsonHashFile();
		this.hash = (String) parsedMap.get("hash");

		return hash;
	}
}
