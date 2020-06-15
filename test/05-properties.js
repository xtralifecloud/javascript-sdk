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

describe('Gamer Properties', function () {

    let properties = null;

    it('it should login first', done => {
        Clan.login(null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            properties = Clan.withGamer(gamer).properties('private');
            done();
        })
    });

    it('should set a property', done => {
        properties.set("board", "square", function (err, res) {
            res.should.have.property("done");
            done();
        })
    });


    it('should set another property', done => {
        properties.set("level", 10, function (err, res) {
            res.should.have.property("done");
            done();
        })
    });

    it('should get a property', done => { properties.get("board", (err, res) => done()) });


    it('should get a all properties', done => {
        properties.load(function (err, res) {
            res.should.have.property("properties");
            done();
        })
    });

    it('should del a property', done => {
        properties.delete("board", function (err, res) {
            res.should.have.property("done");
            done();
        })
    });

    it('should replace all properties', done => {
        properties.save({ board: "round", level: 20 }, function (err, res) {
            res.should.have.property("done");
            done();
        })
    });

    // removed from the API, use the indexing API instead
    it.skip('should find a user matching properties', done => {
        properties.find({ level: { '$gt': 10 } }, function (err, res) {
            res.should.have.property("gamers");
            done();
        })
    });

    it('should delete all properties', done => {
        properties.remove(function (err, res) {
            res.should.have.property("done");
            done();
        })
    });
});

