package cj.oshopping.ecstatic.webjar.taglib;

import java.io.IOException;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.BodyTagSupport;
import javax.servlet.jsp.tagext.Tag;

import org.apache.commons.lang3.StringUtils;

import com.google.common.base.Objects;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import cj.oshopping.ecstatic.webjar.taglib.config.WebJarConfig;
import cj.oshopping.ecstatic.webjar.taglib.loader.BaseUrlLoader;
import cj.oshopping.ecstatic.webjar.taglib.loader.PhaseLoader;
import cj.oshopping.ecstatic.webjar.taglib.loader.SrcLoader;
import cj.oshopping.ecstatic.webjar.taglib.org.springframework.util.ClassUtils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * <p>
 * webjar 로 패치징된 resource를 가리킬 때 지원해주는 Tab Library 이다. 현재 운영중인 환경 (phase) 및 여러 webjar 들을 지원한다. 또한 렌더링 되는 url 내에 hash를 injection 을 추가해 immutable 한 static resource 지원을 한다.
 * </p>
 * 
 * <p>
 * 예시:<br>
 * 
 * <pre>
 * {@code
 * 		<webjars:resource artifactId="ec-static-common" src=
"/dist/common-cjos-mobile/common.cjos.mobile.lib.min.js" />
 *  }
 * </pre>
 * 
 * <br>
 * 생성되는 URL 구성은 [phase][baseUrl]/[artifactId]/[baseUrl] 순서로 구성된다.
 * <ul>
 * <li>개발환경(local,dev,qa)인 경우: http://dev-image.cjmall.net/static/webjars/ec-static-common/dist/common-cjos-mobile/1a2b3c4d5e/common.cjos.mobile.lib.min.js</li>
 * <li>운영환경(staging,prod)인 경우: http://image.cjmall.net/static/webjars/ec-static-common/dist/common-cjos-mobile/1a2b3c4d5e/common.cjos.mobile.lib.min.js</li>
 * </ul>
 * </p>
 * 
 * 
 * 
 * 각 Attributes 는 다음을 의미한다.
 * <ul>
 * <li>protocol : (<i>optional</i>): 해당 리소스의 protocol 지정한다. 지정하지 않은 경우는 페이지의 Request 에 따라 동작한다. {@link HttpServletRequest#isSecure()} 예시) ( default ) phase=http</li>
 * <li>phase : (<i>optional</i>) : 현재 webjar 를 포함하고 있는 Runtime환경의 phase를 뜻한다. 해당 phase 에 따라 baseUrl 값들이 결정된다. 따라서 특별한 경우가 없다면 phase 를 지정하지 않고 {@link PhaseLoader} 가이드에 따라 환경 설정을 따른다.</li>
 * <li>artifactId : <b>(required)</b>: 로딩하고자 하는 webjar의 파일의 artifact Id를 뜻한다. /META-INF/resource/{artifactId}에 해당하는 webjar 파일이 선택된다. 이 선택에 따라 이에 맞는 환경설정 파일이 선택된다. 예시) ( default )
 * artifactId=ec-static-common</li>
 * <li>baseUrl : (<i>optional</i>) : webjar 파일의 기본 URL 을 뜻한다. 설정하지 않으면 설정된 phase, artifactId 에 따라 webjars 의 환경설정 파일(url.properties)를 읽어 해당 값을 설정한다. 특별한 경우가 없다면 지정하지 않는다. {@linke BaseUrlLoader} 가이드에
 * 따른다.</li>
 * <li>src : <b>(required)</b>: artifactId 디렉토리 하위에 상대경로를 의미한다. src 내에 있는 해시파일이 있는 경우는 해당 디렉토리 상위에 hash 디렉토리가 지정된다. 위치는 {@link SrcLoader } 가이드에 따른다.
 * 
 * 
 * </li>
 * </ul>
 * 
 * @author gookeun lim <gookeun.lim@cj.net>
 *
 */
@Slf4j
public class ResourceTag extends AbstractResourceAwareTag {
	private static final long serialVersionUID = 1L;

	@Override
	public int doEndTag() throws JspException {
		JspWriter writer = this.pageContext.getOut();
		String resourceUrl = null;

		try {
			resourceUrl = getResourceUrl();
			writer.write(resourceUrl);
		} catch (IOException e) {
			log.error("fail to write resourceUrl " + resourceUrl, e);
		}
		return super.doEndTag();
	}
}
