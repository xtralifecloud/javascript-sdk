/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

class ClanError extends Error {
	constructor(status, response) {
		{
			// Hack: trick Babel/TypeScript into allowing this before super.
			if (false) { super(); }
			let thisFn = (() => { return this; }).toString();
			let thisName = thisFn.match(/return (?:_assertThisInitialized\()*(\w+)\)*;/)[1];
			eval(`${thisName} = this;`);
		}
		this.status = status;
		this.response = response;
		this.message = this.response.message;
		this.type = this.response.type;
		this.name = this.response.name;
		if ((this.status < 100) || ((this.status >= 300) && (this.status < 400)) || (this.status >= 500)) {
			this.endpoint.tryOther();
		}
	}
}

module.exports = ClanError;