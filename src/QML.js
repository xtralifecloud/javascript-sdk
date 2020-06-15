// an alternative index.js for QML only

const window = {
	XMLHttpRequest,
};
const setTimeout = function (fn, ms) { };
const clearTimeout = function (timeout) { };

function GetClan() { return require('./Clan.js'); } GetClan();