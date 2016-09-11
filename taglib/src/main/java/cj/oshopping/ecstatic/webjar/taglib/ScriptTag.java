package cj.oshopping.ecstatic.webjar.taglib;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
public class ScriptTag extends AbstractResourceAwareTag {
	private static final long serialVersionUID = 334899308185203068L;

	String type;
	Boolean exportPhase;

	@Override
	protected void initDefaultAttributes() {
		if (StringUtils.isBlank(type)) {
			type = "text/javascript";
		}

		if (BooleanUtils.isNotFalse(exportPhase)) {
			exportPhase = true;
		}

		super.initDefaultAttributes();
	}

	@Override
	public int doEndTag() throws JspException {
		StringBuilder scriptTagBuilder = new StringBuilder(200);

		scriptTagBuilder.append("<script ");

		if (StringUtils.isNotBlank(this.type)) {
			scriptTagBuilder.append("type=\"").append(type).append("\" ");
		}

		String resourceUrl = this.getResourceUrl();
		scriptTagBuilder.append("src=\"").append(resourceUrl).append("\" ");

		if (BooleanUtils.isTrue(exportPhase)) {
			Phase phase = getPhase();
			
			String phaseString;

			if (phase == null) {
				phaseString = config.getProperty(this.getPhase(), this.getArtifactId(), "defaultPhase", String.class);
			} else {
				phaseString = phase.name();
			}

			if (phaseString != null) {
				scriptTagBuilder.append("data-phase=\"").append(phaseString).append("\" ");
			}
		}

		scriptTagBuilder.append("></script>");

		try {
			pageContext.getOut().write(scriptTagBuilder.toString());
		} catch (IOException e) {
			log.error("fail to create a script tag. resourceUrl " + resourceUrl, e);
		}

		return super.doEndTag();
	}

	@Override
	protected void clearAttributes() {
		this.type = null;
		this.exportPhase = null;

		super.clearAttributes();
	}
}
