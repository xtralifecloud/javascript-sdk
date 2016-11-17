// This is our StorageManager constructor to handle all data relative to stored data
function StorageManager()
{
	
}

// Get data from local storage
StorageManager.prototype.GetData = function(dataName)
{
	return localStorage.getItem(dataName);
}

// Set data into local storage
StorageManager.prototype.SetData = function(dataName, dataValue)
{
	localStorage.setItem(dataName, dataValue);
}

// Delete data from local storage
StorageManager.prototype.DeleteData = function(dataName)
{
	localStorage.removeItem(dataName);
}
