require('mocha')
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should = require('should');

const Clan = require('../src/Clan.js')('testgame-key', 'testgame-secret'); // app credentials

const dataset = require('./0-dataset.json');

const gamerCred = null;

describe('Gamer Profile', function () {

	let profile = null;

	before('it should login first', done => {
		Clan.login(null, null, null, function (err, gamer) {
			gamer.should.have.property('gamer_id');
			gamer.should.have.property('gamer_secret');
			profile = Clan.withGamer(gamer).profile();
			done();
		})
	});

	it('should fetch the profile', done => {
		profile.get(function (err, res) {
			should.exist(res.displayName);
			res.lang.should.eql('en');
			done();
		})
	});

	it('should alter the profile', function (done) {
		const newName = 'The Roxxor' + Math.floor(Math.random() * 10000);
		profile.set({ displayName: newName }, function (err, res) {
			res.done.should.eql(1);
			res.profile.displayName.should.eql(newName);

			return profile.get(function (err, res) {
				res.displayName.should.eql(newName);
				return done();
			});
		});
	});
});
