package cj.oshopping.ecstatic.webjar.taglib;

import javax.servlet.ServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.BodyTagSupport;
import javax.swing.Spring;

import com.google.common.base.Objects;

import cj.oshopping.ecstatic.webjar.taglib.config.WebJarConfig;
import cj.oshopping.ecstatic.webjar.taglib.loader.BaseUrlLoader;
import cj.oshopping.ecstatic.webjar.taglib.loader.PhaseLoader;
import cj.oshopping.ecstatic.webjar.taglib.loader.SrcLoader;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
public abstract class AbstractResourceAwareTag extends BodyTagSupport {
	private static final long serialVersionUID = 1L;

	/**
	 * 생성하는 URL Protocol 속성. 설정하지 않으면 현재 요청 페이지의 Protocol을 따른다. {@link ServletRequest#getScheme()}
	 */
	private String protocol;

	/**
	 * 현재 Runtime 의 phase 정보 Phase 설정된 Profile 설정에 따라 동작한다. Phase 의 결정은 다음 순서에 따른다.
	 * 
	 * <ul>
	 * <li>Spring 환경이라면 현재 WebApplicationContext Spring 의 Envrionment 설정에 따라 다르게 된다.</li>
	 * <li>위 환경에서 설정을 찾을 수 없다면 -Dwebjars.phase={phase} 설젱에 따라 환경설정이 동작한다.</li>
	 * </ul>
	 * 
	 * 설정할 수 있는 Phase 는 local, dev, qa, staging, prod 이다.
	 * 
	 * @see Spring Boot 에서 Profile 설정 http://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-profiles.html
	 */
	private Phase phase;

	/**
	 * webjar 로 압축된 모듈(maven)의 artifactId ec-static 의 경우 ec-static-common 이다.
	 * 
	 */
	private String artifactId;

	/**
	 * 접속할 호스트 및 포트 설정. ec-static 내 webjar내에 있는 properties 속성을 따른다. baseUrl 로딩시 사용될 properties 는 {@link #phase}에 따라 동작한다.
	 * 
	 * 환경변수 값은 {@link #artifactId} 설정에 따라 url-{phase}.properties 를 읽어 동작한다. 로딩되는 값은 다음 이름 Rule 을 따른다. webjar.{artifactId}.{key}={value}
	 * 
	 * <pre>
	 * 
	 * </pre>
	 */
	private String baseUrl;

	/**
	 * baseUrl 하위에 리소스의 상대경로
	 */
	private String src;

	public void setPhase(String phaseString) {
		if (phaseString != null) {
			try {
				this.phase = Phase.valueOf(phaseString);
			} catch (IllegalArgumentException e) {
				log.warn("a given phase attribute {} is . try to find a default phase.", phase);
			}
		}
	}

	@Override
	public int doStartTag() throws JspException {
		checkRequiredAttribute();
		initDefaultAttributes();
		return super.doStartTag();
	}

	private void checkRequiredAttribute() {
		Assert.notBlank(artifactId, "artifactId는 설정돼야 합니다.");
		Assert.notBlank(src, "src는 설정돼야 합니다.");
	}

	/**
	 * 각 Field 들의 Default 값을 설정하는 초기화 함수
	 */
	protected void initDefaultAttributes() {
		initProtocol();
		initPhase();
		initBaseUrl();
	}

	private void initProtocol() {
		if (protocol != null) {
			return;
		}

		this.protocol = this.pageContext.getRequest().getScheme();
	}

	protected static WebJarConfig config = new WebJarConfig();
	private static PhaseLoader phaseLoader = new PhaseLoader();
	private static BaseUrlLoader baseUrlLoader = new BaseUrlLoader(config);
	private static SrcLoader srcLoader = new SrcLoader(config);

	/**
	 * Phase 설정 정보를 설정하는 함수. 읽는 환경은 조건은 {@link PhaseLoader}를 참조
	 */
	private void initPhase() {
		if (phase != null) {
			return;
		}

		this.phase = phaseLoader.load(pageContext);
	}

	/**
	 * 설정된 Target 정보의 url.properties 에서 default host 설정을 얻는 함수. 로컬 개발시 url 을 override 하고 싶다면 {@link BaseUrlLoader} 를 참고한다.
	 */
	private void initBaseUrl() {
		if (this.baseUrl != null) {
			return;
		}

		
		this.baseUrl = baseUrlLoader.load(phase, artifactId, Objects.equal(this.protocol, "https"));
	}

	protected String getResourceUrl() {

		String hashedSrc = getHashedSrc();

		StringBuilder builder = new StringBuilder(baseUrl.length() + hashedSrc.length());

		builder.append(this.baseUrl);
		if (this.baseUrl.endsWith("/") && hashedSrc.startsWith("/")) {
			builder.append(hashedSrc.substring(1));
		}

		return builder.toString();

	}
	
	private String getHashedSrc() {
		return srcLoader.load(phase, artifactId, src);
	}
	
	@Override
	public int doEndTag() throws JspException {
		clearAttributes();
		return super.doEndTag();
	}

	protected void clearAttributes() {
		this.protocol = null;
		this.phase = null;
		this.artifactId = null;
		this.baseUrl = null;
		this.src = null;
	}
}
