package cj.oshopping.ecstatic.webjar.taglib;

import org.apache.commons.lang3.StringUtils;

public class Assert {

	public static void notBlank(String value, String message) {
		if ( StringUtils.isBlank(value)) {
			throw new IllegalArgumentException(message);
		}
	}
	
}
