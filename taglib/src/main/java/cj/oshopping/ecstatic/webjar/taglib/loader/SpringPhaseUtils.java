package cj.oshopping.ecstatic.webjar.taglib.loader;

import javax.servlet.ServletContext;

import org.springframework.core.env.Environment;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import cj.oshopping.ecstatic.webjar.taglib.Phase;

public abstract class SpringPhaseUtils {

	public static Phase load(final ServletContext servletContext) {
		WebApplicationContext webapplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
		if (webapplicationContext == null || webapplicationContext.getEnvironment() == null) {
			return null;
		}

		Environment environment = webapplicationContext.getEnvironment();

		return Phase.getPhaseIfMatched(environment.getActiveProfiles());

	}
}
