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

describe('Gamer Leaderboards', function () {

    let leaderboards = null;

    describe("score as friend ", function () {

        it('it should login first as friend', done => {
            Clan.login(null, function (err, gamer) {
                gamer.should.have.property('gamer_id');
                gamer.should.have.property('gamer_secret');
                leaderboards = Clan.withGamer(gamer).leaderboards('private');
                done();
            })
        });

        it('should set a score', done => {
            leaderboards.set("level1", "hightolow", { score: 20, info: "using mickey" }, function (err, res) {
                res.should.have.property("done");
                done();
            })
        });

        it('should set another score', done => {
            leaderboards.set("level2", "lowtohigh", { score: 110, info: "using minie" }, function (err, res) {
                res.should.have.property("done");
                done();
            })
        });

        it("should get user's scores", done => {
            leaderboards.get(function (err, res) {
                res.should.have.property("level1");
                res.level1.should.have.property("score");
                res.should.have.property("level2");
                res.level2.should.have.property("score");
                done();
            })
        });
    });

    describe("score as gamer ", function () {

        it('it should login as gamer', done => {
            Clan.login(null, function (err, gamer) {
                gamer.should.have.property('gamer_id');
                gamer.should.have.property('gamer_secret');
                leaderboards = Clan.withGamer(gamer).leaderboards('private');
                done();
            })
        });

        it('should set a score', done => {
            leaderboards.set("level1", "hightolow", { score: 10, info: "using mickey" }, function (err, res) {
                res.should.have.property("done");
                done();
            })
        });

        it('should set another score', done => {
            leaderboards.set("level2", "lowtohigh", { score: 100, info: "using minie" }, function (err, res) {
                res.should.have.property("done");
                done();
            })
        });

        it("should get user's scores", done => {
            leaderboards.get(function (err, res) {
                res.should.have.property("level1");
                res.level1.should.have.property("score");
                res.should.have.property("level2");
                res.level2.should.have.property("score");
                done();
            })
        });

        it("should get 10 best highscore on level1", done => {
            leaderboards.getHighscores("level1", 1, 10, function (err, res) {
                res.should.have.property("level1");
                res.level1.should.have.property("scores");
                done();
            })
        });

        it("should get 10 best highscore on level2", done => {
            leaderboards.getHighscores("level2", 1, 10, function (err, res) {
                res.should.have.property("level2");
                res.level2.should.have.property("scores");
                done();
            })
        });
    });
});
