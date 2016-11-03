// Allow to set and get data; In this sample and because we handle very few data, we will use cookies to simply store data without using an entire database
function StorageManager()
{
	this.cookiesExpirationDelay = 7 * 24 * 60 * 60 * 1000;
}

// Get data from cookie
StorageManager.prototype.GetData = function(dataName)
{
	dataName += "=";
	var cookieArray = document.cookie.split(';');
	
	for (var item = 0 ; item < cookieArray.length ; item++)
	{
		var cookieItem = cookieArray[item];
		
		while (cookieItem.charAt(0) == ' ')
			cookieItem = cookieItem.substring(1);
		
		if (cookieItem.indexOf(dataName) == 0)
			return cookieItem.substring(dataName.length, cookieItem.length);
	}
	
	return "";
}

// Set data in a cookie
StorageManager.prototype.SetData = function(dataName, dataValue)
{
	var cookieExpirationDate = new Date();
	cookieExpirationDate.setTime(cookieExpirationDate.getTime() + this.cookiesExpirationDelay);
	
	document.cookie = dataName + "=" + dataValue + ";expires=" + cookieExpirationDate.toUTCString() + ";path=/";
}

// Delete data from cookie
StorageManager.prototype.DeleteData = function(dataName)
{
	var cookieExpirationDate = new Date();
	cookieExpirationDate.setTime(0);
	
	document.cookie = dataName + "=;expires=" + cookieExpirationDate.toUTCString() + ";path=/";
}

// Log all data found in cookie to console
StorageManager.prototype.LogAllData = function()
{
	ConsoleLog("------------------------------ Stored data ------------------------------");
	
	var cookieArray = document.cookie.split(';');
	
	for (var item = 0 ; item < cookieArray.length ; item++)
	{
		var cookieItem = cookieArray[item];
		
		while (cookieItem.charAt(0) == ' ')
			cookieItem = cookieItem.substring(1);
		
		ConsoleLog(cookieItem);
	}
	
	ConsoleLog("-------------------------------------------------------------------------");
}
