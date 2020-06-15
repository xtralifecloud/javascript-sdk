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

const gamerCred = null;

describe('Gamer Friends', function () {

    let friends = null;

    before('it should login first', done => {
        Clan.login(null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            friends = Clan.withGamer(gamer).friends('private');
            done();
        })
    });

    it('should create a friend', done => {
        Clan.login(null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');

            dataset.friend_id = gamer.gamer_id;
            dataset.friend_token = gamer.gamer_secret;
            done();
        })
    });

    it('should call change relationship to friend', done => {
        friends.status(dataset.friend_id, "add", function (err, res) {
            res.should.have.property("done");
            done();
        })
    });

    it('should call get', done => {
        friends.get(function (err, res) {
            if (err != null) { done(err); return }
            res.friends.should.containDeep([{ gamer_id: dataset.friend_id }]);
            done();
        })
    });

    it('should call change relationship to blacklist', done => {
        friends.status(dataset.friend_id, "blacklist", function (err, res) {
            res.should.have.property("done");
            done();
        })
    });

    it('should call getBlacklisted', done => {
        friends.getBlacklisted(function (err, res) {
            res.blacklisted.should.containDeep([{ gamer_id: dataset.friend_id }]);
            done();
        })
    });

    it('should call change relationship to forget', done => {
        friends.status(dataset.friend_id, "forget", function (err, res) {
            res.should.have.property("done");
            done();
        })
    });
});


