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
public class CssTag extends AbstractResourceAwareTag {
	private static final long serialVersionUID = -7636468613779681365L;
	
	String type;
	String rel;

	@Override
	protected void initDefaultAttributes() {
		if (StringUtils.isBlank(type)) {
			type = "text/css";
		}

		if (StringUtils.isBlank(rel)) {
			rel = "stylesheet";
		}
		
		super.initDefaultAttributes();
	}

	@Override
	public int doEndTag() throws JspException {
		StringBuilder linkTagBuilder = new StringBuilder(200);

		linkTagBuilder.append("<link ");

		if (StringUtils.isNotBlank(this.rel)) {
			linkTagBuilder.append("rel=\"").append(rel).append("\" ");
		}
		
		if (StringUtils.isNotBlank(this.type)) {
			linkTagBuilder.append("type=\"").append(type).append("\" ");
		}

		String resourceUrl = this.getResourceUrl();
		linkTagBuilder.append("href=\"").append(resourceUrl).append("\" ");

		linkTagBuilder.append(" >");

		try {
			pageContext.getOut().write(linkTagBuilder.toString());
		} catch (IOException e) {
			log.error("fail to create a csst tag. resourceUrl " + resourceUrl, e);
		}

		return super.doEndTag();
	}

	@Override
	protected void clearAttributes() {
		this.type = null;
		this.rel = null;

		super.clearAttributes();
	}
}
