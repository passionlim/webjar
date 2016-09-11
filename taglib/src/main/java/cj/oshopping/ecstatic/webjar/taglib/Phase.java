package cj.oshopping.ecstatic.webjar.taglib;

/**
 * 동작 환경에 대한 Phase 정보
 * 
 * @author gookeun lim <gookeun.lim@cj.net>
 *
 */
public enum Phase {

	local(DatabaseEnv.dev, RuntimeEnv.test), dev(DatabaseEnv.dev, RuntimeEnv.test), qa(DatabaseEnv.qa, RuntimeEnv.test), staging(DatabaseEnv.production,
			RuntimeEnv.production), prod(DatabaseEnv.production, RuntimeEnv.production);

	public static final String WEBJAR_PROPERTY_PREFIX = "webjar.";

	private DatabaseEnv databaseEnv;
	private RuntimeEnv runtimeEnv;

	private Phase(DatabaseEnv databaseEnv, RuntimeEnv runtimeEnv) {
		this.databaseEnv = databaseEnv;
		this.runtimeEnv = runtimeEnv;
	}

	public DatabaseEnv getDatabaseEnv() {
		return databaseEnv;
	}

	public RuntimeEnv getRuntimeEnv() {
		return runtimeEnv;
	}

	/**
	 * 테스트/운영 개발환경 구분
	 * 
	 * @author gookeun lim <gookeun.lim@cj.net>
	 *
	 */
	public static enum RuntimeEnv {
		test, production;
	}

	/**
	 * DB 운영환경 구분
	 * 
	 * @author gookeun lim <gookeun.lim@cj.net>
	 *
	 */
	public static enum DatabaseEnv {
		dev, qa, production;
	}

	/**
	 * 주어진 phase 정보중 맞는 phase 값을 찾는 함수
	 * 
	 * @param phases
	 * @return
	 */
	public static Phase getPhaseIfMatched(String... phases) {
		for (String phaseString : phases) {
			try {
				return Phase.valueOf(phaseString);
			} catch (Exception e) {
				continue;
			}
		}

		return null;
	}

}
