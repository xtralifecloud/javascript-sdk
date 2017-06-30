// Initialize the Facebook Javascript SDK when loading page
window.fbAsyncInit = function()
{
	FB.init({appId: "184978405369781", cookie: true, xfbml: true, version: "v2.8"});
	FB.AppEvents.logPageView();
	
	// Now that we've initialized the JavaScript SDK, we call FB.getLoginStatus().
	// This function gets the state of the person visiting this page and can return one of
	// three states to the callback you provide. They can be:
	//
	// 1. Logged into your app ("connected")
	// 2. Logged into Facebook, but not your app ("not_authorized")
	// 3. Not logged into Facebook and can't tell if they are logged into your app or not.
	//
	// These three cases are handled in the callback function.
	
	FB.getLoginStatus(function(response)
	{
		facebook.StatusChangeCallback(response);
	});
};

// Load the Facebook Javascript SDK asynchronously
(function(d, s, id)
{
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) { return; }
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	// js.src = "//connect.facebook.net/en_US/sdk/debug.js";
	fjs.parentNode.insertBefore(js, fjs);
}
(document, 'script', 'facebook-jssdk')
);

var facebook = new Facebook();

// This is our Facebook constructor to handle all data relative to the Facebook Javascript SDK
function Facebook() {};

// This function is called when someone finishes with the Login Button.
// See the onlogin handler attached to it in the sample code below.
Facebook.prototype.CheckLoginState = function(ReturnFacebookAccessToken)
{
	FB.getLoginStatus(function(response)
	{
		if (ReturnFacebookAccessToken)
			ReturnFacebookAccessToken(facebook.StatusChangeCallback(response));
		else
			facebook.StatusChangeCallback(response);
	});
};

// This is called with the results from from FB.getLoginStatus().
Facebook.prototype.StatusChangeCallback = function(response)
{
	console.log("[Facebook] StatusChangeCallback (Response: " + JSON.stringify(response) + ")");
	
	// The response object is returned with a status field that lets the app know the current login status of the person.
	// Full docs on the response object can be found in the documentation for FB.getLoginStatus().
	if (response.status === "connected")
	{
		// Logged into your app and Facebook.
		console.log("[Facebook] Logged into Facebook and Facebook's app");
		facebook.TestAPI();
		return response.authResponse.accessToken;
	}
	else if (response.status === "not_authorized")
	{
		// The person is logged into Facebook, but not your app.
		console.log("[Facebook] Logged into Facebook but not logged into Facebook's app");
		return null;
	}
	else
	{
		// The person is not logged into Facebook, so we're not sure if
		// they are logged into this app or not.
		console.log("[Facebook] Not logged into Facebook");
		return null;
	}
};

// Here we run a very simple test of the Graph API after login is successful. See StatusChangeCallback() for when this call is made.
Facebook.prototype.TestAPI = function()
{
	console.log("[Facebook] Fetching logged in person information...");
	FB.api("/me", function(response)
	{
		console.log("[Facebook] Successful login for: " + response.name);
	});
};

// Login into Facebook and Facebook's app (when user click on a "Facebook Login" button e.g.)
Facebook.prototype.FacebookAppLogin = function(AfterLogin)
{
	// Check if an user is already logged into Facebook and Facebook's app
	facebook.CheckLoginState(function(facebookAccessToken)
	{
		// If not logged in, ask the user to log into Facebook
		if (!facebookAccessToken)
		{
			console.log("[Facebook] Ask user to log in...");
			
			FB.login(function()
			{
				// Check again if an user is logged in (may not be the case if the login window is closed e.g.)
				facebook.CheckLoginState(function(facebookAccessToken)
				{
					// If logged in return the access token, if not return null (we don't loop login attempts for obvious reasons)
					AfterLogin(facebookAccessToken);
				});
			}, {scope: "public_profile,email"});
		}
		// If logged in, return the access token
		else
			AfterLogin(facebookAccessToken);
	});
};
