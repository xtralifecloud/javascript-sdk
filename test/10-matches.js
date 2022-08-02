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

let events_gamer = null;
let matches = null;

let events_friend = null;
let matches_friend = null;

let matchID = null;
let lastEventId = null;

describe('Matches', function () {

    it('should login first as gamer', done => {
        Clan.login(null, null, null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            events_gamer = Clan.withGamer(gamer).events('private');
            matches = Clan.withGamer(gamer).matches(Clan.privateDomain);
            done(err);
        })
    });

    it('should login now as friend', done => {
        Clan.login(null, null, null, function (err, friend) {
            friend.should.have.property('gamer_id');
            friend.should.have.property('gamer_secret');
            events_friend = Clan.withGamer(friend).events('private');
            matches_friend = Clan.withGamer(friend).matches(Clan.privateDomain);
            done(err);
        })
    });

    it('should create a match', function (done) {
        const match = {
            description: "Batlle Card Sample",
            maxPlayers: 2,
            customProperties: { type: "battle", cardsCount: "8" },
            shoe: [
                { name: "Ace", value: 14 },
                { name: "King", value: 13 },
                { name: "Queen", value: 12 },
                { name: "Jack", value: 11 },
                { name: "10", value: 10 },
                { name: "9", value: 9 },
                { name: "8", value: 8 },
                { name: "7", value: 7 }
            ]
        };

        matches.create(match, function (err, res) {
            should(err).be.null;
            res.should.have.property('match');
            res.match.should.have.property('_id');
            res.match.should.have.property('lastEventId');
            matchID = res.match._id;
            ({
                lastEventId
            } = res.match);
            return done(err);
        });
    });

    it('friend should list open matches', done => {
        matches_friend.list({ type: "battle" }, function (err, list) {
            should(err).be.null;
            list.should.have.property('matches');
            list.matches.should.be.Array();
            done(err);
        })
    });

    it('friend should join a match', done => {
        matches_friend.join(matchID, {}, function (err, res) {
            should(err).be.null;
            res.should.have.property('match');
            res.match.should.have.property('_id');
            res.match._id.should.eql(matchID);
            done(err);
        })
    });

    it('gamer should receive a message', done => {
        events_gamer.receive('auto', function (err, message) {
            should(err).be.null;
            message.should.have.property('type');
            message.type.should.eql('match.join');
            done(err);
        })
    });

    it('should get match data', done => {
        matches.get(matchID, function (err, data) {
            should(err).be.null;
            should.exist(data.match.lastEventId);
            ({
                lastEventId
            } = data.match);
            done(err);
        })
    });

    it('gamer should make a move', function (done) {
        const move = {
            type: "bet",
            amount: 10
        };
        matches.move(matchID, lastEventId, move, function (err, res) {
            if (err != null) { return done(err); }
            should.exist(res.match.lastEventId);
            ({
                lastEventId
            } = res.match);
            return done(err);
        });
    });


    it('friend should recieve a message', done => {
        events_friend.receive('auto', function (err, message) {
            should(err).be.null;
            message.should.have.property('type');
            message.type.should.eql('match.move');
            done(err);
        })
    });

    it('friend should get match data', done => {
        matches_friend.get(matchID, function (err, data) {
            should(err).be.null;
            should.exist(data.match.lastEventId);
            ({
                lastEventId
            } = data.match);
            done(err);
        })
    });

    it('friend should make a move', function (done) {
        const move = {
            type: "bet",
            amount: 10
        };
        matches_friend.move(matchID, lastEventId, move, function (err, res) {
            should(err).be.null;
            should.exist(res.match.lastEventId);
            ({
                lastEventId
            } = res.match);
            return done(err);
        });
    });

    it('gamer should recieve a message', done => {
        events_gamer.receive('auto', function (err, message) {
            should(err).be.null;
            message.should.have.property('type');
            message.type.should.eql('match.move');
            done(err);
        })
    });

    it('gamer should draw cards', done => {
        matches.draw(matchID, lastEventId, 4, {}, function (err, res) {
            should(err).be.null;
            should.exist(res.match.lastEventId);
            ({
                lastEventId
            } = res.match);
            should.exist(res.drawnItems);
            res.drawnItems.length.should.eql(4);
            done(err);
        })
    });

    it('friend should recieve a message', done => {
        events_friend.receive('auto', function (err, message) {
            should(err).be.null;
            message.should.have.property('type');
            message.type.should.eql('match.shoedraw');
            done(err);
        })
    });

    it('friend should draw cards', done => {
        matches_friend.draw(matchID, lastEventId, 4, {}, function (err, res) {
            should(err).be.null;
            should.exist(res.match.lastEventId);
            ({
                lastEventId
            } = res.match);
            should.exist(res.drawnItems);
            res.drawnItems.length.should.eql(4);
            done(err);
        })
    });

    it('gamer should recieve a message', done => {
        events_gamer.receive('auto', function (err, message) {
            should(err).be.null;
            message.should.have.property('type');
            message.type.should.eql('match.shoedraw');
            done(err);
        })
    });

    it('should finish the match', done => {
        matches.finish(matchID, lastEventId, {}, function (err, res) {
            should(err).be.null;
            done(err);
        })
    });

    it('should reveal the shoe after the match has ended', done => {
        matches.get(matchID, function (err, data) {
            should(err).be.null;
            should.exist(data.match.shoe);
            done(err);
        })
    });

    it('should delete the match', done => {
        matches.del(matchID, function (err, res) {
            should(err).be.null;
            done(err);
        })
    });
});
