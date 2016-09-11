package cj.oshopping.ecstatic.webjar.taglib.loader;

import org.apache.commons.lang3.StringUtils;

import cj.oshopping.ecstatic.webjar.taglib.Phase;
import cj.oshopping.ecstatic.webjar.taglib.config.WebJarConfig;

public class SystemPropertyPhaseUtils {

	public static Phase load() {
		String phaseString = System.getProperty(WebJarConfig.SYSTEM_PROPERTY_KEY_PREFIX + ".phase");

		if (StringUtils.isEmpty(phaseString)) {
			return null;
		}

		return Phase.valueOf(phaseString);
	}

}
