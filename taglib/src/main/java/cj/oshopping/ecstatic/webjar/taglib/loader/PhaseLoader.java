package cj.oshopping.ecstatic.webjar.taglib.loader;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;

import javax.servlet.ServletContext;
import javax.servlet.jsp.PageContext;

import com.google.common.base.Optional;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import cj.oshopping.ecstatic.webjar.taglib.Phase;
import cj.oshopping.ecstatic.webjar.taglib.ResourceTag;
import cj.oshopping.ecstatic.webjar.taglib.org.springframework.util.ClassUtils;

public class PhaseLoader {
	/**
	 * Spring Profile 지원여부
	 */
	private boolean supportsSringProfile = ClassUtils.isPresent("org.springframework.core.env.Environment", ResourceTag.class.getClassLoader());

	/**
	 * ServletContext별로 Phase 를 캐싱
	 */
	private Cache<ServletContext, Optional<Phase>> phaseCache = CacheBuilder.newBuilder()
			.weakKeys()
			.build();

	public Phase load(PageContext pageContext) {
		final ServletContext servletContext = pageContext.getServletContext();

		try {
			Optional<Phase> optional = phaseCache.get(servletContext, new Callable<Optional<Phase>>() {
				@Override
				public Optional<Phase> call() throws Exception {
					return Optional.fromNullable(getCurrentPhaseObject(servletContext));
				}
			});
			
			return optional.isPresent() ? optional.get() : null;
		} catch (ExecutionException e) {
			throw new IllegalStateException("fail to load a phase from spring profiles or properties.", e);
		}
	}

	/**
	 * Spring Context 또는 SystemProperty 에서 Phase 정보를 얻는 함수
	 * 
	 * @param servletContext
	 * @return
	 */
	private Phase getCurrentPhaseObject(ServletContext servletContext) {
		Phase returnPhase = null;

		if (returnPhase == null) {
			returnPhase = SystemPropertyPhaseUtils.load();
		}

		if (supportsSringProfile) {
			returnPhase = SpringPhaseUtils.load(servletContext);
		}

		return returnPhase;
	}

}
