<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		
		<title>JS CotC SDK Sample</title>
		
		<link href="img/favicon.ico" rel="icon" type="image/x-icon" />
		
		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/style.css" rel="stylesheet" type="text/css" />
		<link href="css/header.css" rel="stylesheet" type="text/css" />
		<link href="css/footer.css" rel="stylesheet" type="text/css" />
		
		<script src="js/cloudbuilder.js" type="text/javascript"></script>
	</head>
	
	<body>
		<?php $currentPage = "index"; include("header.php"); ?>
		<div class="content">
			<h1>JS CotC SDK Sample</h1>
			<p>You're currently browsing a sample showing some of the XtraLife Javascript SDK's social features. Feel free to use/modify your local copy of this code for your own purposes.</p>
			<p><u><b>Important!</b></u> Before anything, you need to register for free on <a href="http://xtralife.cloud" target="_blank">XtraLife.cloud</a> and retrieve your game's provided Api Key and Secret. Report them at the beginning of the <b>"cloudbuilder.js"</b> file (in the <b>"js"</b> folder of the present sample) in the corresponding variables. Then, you may clone our <a href="https://github.com/xtralifecloud/javascript-sdk" target="_blank">Javascript SDK github repository</a> to get the last version of <b>"bundle.min.js"</b> if necessary and start using the SDK.</p>
			<p>The "JS client" can be used both from node.js or from a web browser. It's written in Coffee-script, then compiled to javascript with Browserify and optionnally minified to a mere 36kB, less than 8kB after gzip compression.</p>
			<p>Note: This client is not feature complete yet. It implements the latest API. Feel free to submit bug reports and/or pull requests.</p>
			<p>You can read more about concepts and data model on <a href="https://github.com/xtralifecloud/api/wiki" target="_blank">API Wiki</a>.</p>
			<br />
		</div>
		<?php include("footer.php"); ?>
		
		<script type="text/javascript">
		  <!--
			CheckCredentials();
		  //-->
		</script>
	</body>
</html>
