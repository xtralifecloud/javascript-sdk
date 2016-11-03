function ConsoleLog(message)
{
	console.log(">> " + message + "\n\n");
	document.getElementById("console").innerHTML = ">> " + message + "<br /><br />" + document.getElementById("console").innerHTML;
}
