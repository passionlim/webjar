package cj.oshopping.ecstatic.webjar.taglib.resource;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * hash 패턴이 매치되는지 여부를 지원해주는 Util Class
 * 
 * resource path 패턴매치결과를 통해<br>
 * - 해시가 저장된 파일 경로를 찾는 기능<br>
 * - 해시를 붙인 경로를 만들어 주는 기능<br>
 * <br>
 * 
 * Others 와 Javascript 별로 별도 구현되었다. {@link OthersResourceResult} {@link JavascriptResourceMatch}
 * 
 * @author passion
 *
 */
public abstract class HashResourceMatch {
	private static final int HASH_SIZE = 33;
	protected Matcher matcher;

	public HashResourceMatch(Matcher matcher) {
		this.matcher = matcher;
	}

	public boolean matches() {
		return matcher.matches();
	}

	public abstract String getJsonFilePath();

	public abstract String getHashedResource(String hash);

	/**
	 * css/image/html 용 others resource path 패턴 매치
	 * 
	 * @author passion
	 *
	 */
	public static class OthersResourceResult extends HashResourceMatch {
		private static Pattern othersResourcePattern = Pattern.compile("((/?([^/]+/)*?)(([^/]+)/)?others/)(.*)");
		private String originalText;

		public OthersResourceResult(Matcher matcher, String originalText) {
			super(matcher);
			this.originalText = originalText;
		}

		public String getJsonFilePath() {
			StringBuilder result = new StringBuilder(originalText.length() + HASH_SIZE);

			String prefix = matcher.group(1);
			String moduleId = matcher.group(5);

			if (prefix != null) {
				result.append(prefix);
			}
			
			if ( moduleId == null ) {
				result.append("others.json");
			} else {
				result.append(moduleId.replace('-', '.')).append(".others.json");
			}
			
			return result.toString();
		}

		public static OthersResourceResult createIfMatch(String resource) {
			Matcher matcher = othersResourcePattern.matcher(resource);
			return matcher != null && matcher.matches() ? new OthersResourceResult(matcher, resource) : null;
		}

		@Override
		public String getHashedResource(String hash) {
			StringBuilder result = new StringBuilder(originalText.length() + HASH_SIZE);

			String prefix = matcher.group(1);
			String remainPath = matcher.group(6);

			if (prefix != null) {
				result.append(prefix);
			}
			
			if ( hash != null ) {
				result.append(hash).append("/");
			}
			
			result.append(remainPath);

			return result.toString();
		}
	}

	/**
	 * javascript 용 resource path 패턴 매치
	 * 
	 * @author passion
	 *
	 */
	public static class JavascriptResourceMatch extends HashResourceMatch {
		private static Pattern javascriptPattern = Pattern.compile("(/?([^/]+/)*)(([^/]+)\\.(amd|min)\\.js.*)");
		private String originalText;

		public JavascriptResourceMatch(Matcher matcher, String originalText) {
			super(matcher);
			this.originalText = originalText;
		}

		public String getJsonFilePath() {
			StringBuilder result = new StringBuilder(originalText.length() + HASH_SIZE);

			String prefix = matcher.group(1);
			String fileNamePrefix = matcher.group(4);

			if (prefix != null) {
				result.append(prefix);
			}

			result.append(fileNamePrefix).append(".min.js.json");

			return result.toString();
		}

		public static JavascriptResourceMatch createIfMatch(String resource) {
			Matcher matcher = javascriptPattern.matcher(resource);
			return matcher.matches() ? new JavascriptResourceMatch(matcher, resource) : null;
		}

		@Override
		public String getHashedResource(String hash) {
			StringBuilder result = new StringBuilder(originalText.length() + HASH_SIZE);

			String prefix = matcher.group(1);
			String fileName = matcher.group(3);

			if (prefix != null) {
				result.append(prefix);
			}

			if ( hash != null ) {
				result.append(hash).append("/");
			}
			
			result.append(fileName);

			return result.toString();
		}

	}

}