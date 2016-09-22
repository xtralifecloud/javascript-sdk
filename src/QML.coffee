# an alternative index.coffee for QML only

`var window = {
	XMLHttpRequest: XMLHttpRequest,
};
var setTimeout = function (fn, ms) {};
var clearTimeout = function (timeout) {};

function GetClan() { return require('./Clan.coffee'); } GetClan();`