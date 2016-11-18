// Register callback for received events
Sample.prototype.EventReceiveRegister = function(OnReceiveCallback)
{
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var eventDomain = this.clan.privateDomain;
		
		this.clan.withGamer(this.gamerData).events(eventDomain).receive("auto", OnReceiveCallback);
	}
	// If no gamer is logged in, this feature is unavailable
	else
		ConsoleLog("Event ReceiveRegister error: Can't use event features without logged in gamer data");
}

// Handle received event then register again for next event
Sample.prototype.EventReceived = function(error, receivedEvent)
{
	// If the operation went wrong for some reason
	if (error)
		ConsoleLog("Event error: " + error);
	// If the event loop reaches timeout
	else if (!receivedEvent)
		/* Do nothing */;
	// If the operation succeeded
	else
		ConsoleLog("Event received -> " + JSON.stringify(receivedEvent));
	
	// Register for the next event
	sample.EventReceiveRegister(sample.EventReceived);
}
