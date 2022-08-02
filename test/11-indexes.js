require('mocha')
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should = require('should');

const Clan = require('../src/Clan.js')('testgame-key', 'testgame-secret'); // app credentials

const dataset = require('./0-dataset.json');

let _gamer = null;
let _friend = null;

describe('Indexes', function () {

	const indexes = Clan.indexes(Clan.privateDomain);

	it('it should login first', done => {
		Clan.login(null, null, null, function (err, gamer) {
			gamer.should.have.property('gamer_id');
			gamer.should.have.property('gamer_secret');
			_gamer = gamer;
			return Clan.login(null, null, null, function (err, friend) {
				friend.should.have.property('gamer_id');
				friend.should.have.property('gamer_secret');
				_friend = friend;
				done();
			});
		})
	});


	it('should create an index for gamer', function (done) {
		const properties = {
			level: 20,
			xp: 2016
		};

		const payload =
			{ whatever: "something" };

		indexes.set("testindex", _gamer.gamer_id, properties, payload, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.created);
			res.created.should.be.true;
			return done();
		});
	});

	it('should create an index for friend', function (done) {
		const properties = {
			level: 18,
			xp: 2010
		};

		const payload =
			{ whatever: "something else" };

		indexes.set("testindex", _friend.gamer_id, properties, payload, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.created);
			res.created.should.be.true;
			return done();
		});
	});

	it('should get gamer index', done => {
		indexes.get("testindex", _gamer.gamer_id, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.found);
			res.found.should.be.true;
			res._source.payload.whatever.should.eql('something');
			done();
		})
	});


	it('should search index and sort', done => {
		indexes.search("testindex", "*", '["level:desc"]', 0, 10, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.total);
			should.exist(res.hits);
			res.total.should.greaterThan(1);
			done();
		})
	});

	it('should query index', function (done) {
		const q = {
			query: {
				range: {
					level: {
						from: 15,
						to: 25
					}
				}
			}
		};

		indexes.query("testindex", q, 0, 10, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.total);
			res.total.should.greaterThan(1);
			return done();
		});
	});


	it('should update friend index', function (done) {
		const properties = {
			level: 22,
			xp: 2016
		};

		const payload =
			{ whatever: "other" };

		indexes.set("testindex", _friend.gamer_id, properties, payload, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.created);
			res.created.should.be.false;
			return done();
		});
	});

	it('should query index', function (done) {
		const q = {
			query: {
				range: {
					level: {
						from: 15,
						to: 20,
						include_upper: true
					}
				}
			}
		};

		indexes.query("testindex", q, 0, 10, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.total);
			res.total.should.greaterThan(0);
			return done();
		});
	});



	it('should delete gamer index', done => {
		indexes.del("testindex", _gamer.gamer_id, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.found);
			res.found.should.be.true;
			done();
		})
	});

	it('should delete friend index', done => {
		indexes.del("testindex", _friend.gamer_id, function (err, res) {
			if (err != null) { return done(err); }
			should.exist(res.found);
			res.found.should.be.true;
			done();
		})
	});
});



