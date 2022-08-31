require('mocha')
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should = require('should');
const dataset = require('./0-dataset.json');
const Clan = require('../src/Clan.js')('testgame-key', 'testgame-secret', dataset.endpoint); // app credentials

describe('Events', function () {

	let msgid = null;

	let events = null;

	before('should login first as friend', done => {
		Clan.login(null, {'id':dataset.friend_id, 'secret':dataset.friend_token}, null, function (err, gamer) {
			if (err != null) { done(err); return }
			gamer.should.have.property('gamer_id');
			gamer.should.have.property('gamer_secret');
			events = Clan.withGamer(gamer).events('private');
			done();
		})
	});

	it('should send a message', done => {
		events.send(dataset.gamer_id, { hello: 'friend' }, function (err, res) {
			should(err).be.null;
			msgid = res.id;
			done();
		})
	});

	it('should have sent message to other user', done => {
		Clan.login(null, {'id':dataset.gamer_id, 'secret':dataset.gamer_token}, null, function (err, gamer) {
			if (err != null) { done(err); return }
			gamer.should.have.property('gamer_id');
			gamer.should.have.property('gamer_secret');
			events = Clan.withGamer(gamer).events('private');

			events.receive('auto', function (err, message) {
				should(err).be.null;
				message.event.hello.should.be.eql('friend');
				message.id.should.be.eql(msgid);
				return done();
			});
		})
	});

	it('should block until timeout', function (done) {
		events.receive('auto', function (err, message) {
			if (err != null) { done(err); return }
			should(err).be.null;
			message.event.hello.should.be.eql('friend');
			return done();
		});

		setTimeout(() => events.send(dataset.gamer_id, { hello: 'friend' }, (err, res) => should(err).be.null)
			, 500);
	});

	it.skip('should block until timeout', function (done) {
		this.timeout(50000);
		events.setTimeout(8000);

		events.receive('auto', function (err, message) {
			should(err).be.null;
			should(message).be.null;
			return events.receive('auto', function (err, message) {
				should(err).be.null;
				message.event.hello.should.be.eql('friend');
				return done();
			});
		});

		setTimeout(() => events.send(dataset.gamer_id, { hello: 'friend' }, (err, res) => should(err).be.null)
			, 10000);
	});
});
