<div class="header">
	<table>
		<tr>
			<td class="header-xtralife_logo">
				<a href="http://xtralife.cloud" target="_blank"><img src="img/logo-xtralife.png" alt="[Logo XtraLife]" /></a>
			</td>
			<td class="header-navigation_menu">
				<ul class="navigation_links">
					<?php
						if ($currentPage == "index")
							echo "<li class=\"currentPage\">Home</li>";
						else
							echo "<li><a href=\"./index.php\">Home</a></li>";
						
						if ($currentPage == "login")
							echo "<li class=\"currentPage\">Login</li>";
						else
							echo "<li><a href=\"./login.php\">Login</a></li>";
						
						if ($currentPage == "vfs")
							echo "<li class=\"currentPage\">VFS</li>";
						else
							echo "<li><a href=\"./vfs.php\">VFS</a></li>";
						
						if ($currentPage == "leaderboard")
							echo "<li class=\"currentPage\">Leaderboard</li>";
						else
							echo "<li><a href=\"./leaderboard.php\">Leaderboard</a></li>";
					?>
				</ul>
			</td>
			<td class="header-title">
				<h1>JS CotC SDK Sample</h1>
				<p id="header-login"></p>
			</td>
		</tr>
	</table>
	<p id="header-credentials"></p>
</div>
