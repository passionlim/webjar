<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@taglib prefix="webjar" uri="http://cjoshopping.com/webjars" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Insert title here</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<!-- Optional theme -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    
</head>
<body>
	<h1>Resource Tag</h1>
	
	<h2>Current Phase</h2>
	<div>
	<pre>
	&lt;webjar:res artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.lib.min.js" /&gt; 
	&lt;webjar:res artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.util-ui.min.js" /&gt; 
	&lt;webjar:res artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.util-ui.min.js" /&gt;
	</pre> 
		<br>
		<br>
	<pre>
	<webjar:res artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.lib.min.js" />
	<webjar:res artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.util-ui.min.js" />
	<webjar:res artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.util-ui.min.js" />
	</pre> 
	</div>

	<h1>Script Tag</h1>
	<div>
		<pre>
	&lt;webjar:script artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.lib.min.js" /&gt; 
	&lt;webjar:script artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.util-ui.min.js" /&gt; 
	&lt;webjar:script artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.util-ui.min.js" /&gt;
		</pre> 
		<br><br>
		<pre>
	<webjar:script artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.lib.min.js" /> 
	<webjar:script artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.util-ui.min.js" /> 
	<webjar:script artifactId="sample-webjar" src="/dist/common-cjmall-mobile/js/common.cjmall.mobile.util-ui.min.js" />
		</pre>
		</div>


	<h1>Css Tag</h1>
	<div>
	<pre>
	&lt;webjar:css artifactId="sample-webjar" src="/dist/common-cjmall-mobile/others/css/common.cjmall.mobile.min.css" /&gt; 
	</pre> 
	<br><br>
	<pre>
	<webjar:css artifactId="sample-webjar" src="/dist/common-cjmall-mobile/others/css/common.cjmall.mobile.min.css" /> 
	</pre>
	</div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

</body>
</html>