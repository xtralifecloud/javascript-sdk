require('mocha')
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should = require('should');

const Clan = require('../src/Clan.js')('testgame-key', 'testgame-secret', 'http://localhost:2000'); // app credentials // app credentials

const dataset = require('./0-dataset.json');

const gamerCred = null;

describe('Gamer VFS', function () {

    let vfs = null;

    it('it should login first', done => {
        Clan.login(null, null, null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            vfs = Clan.withGamer(gamer).gamervfs(Clan.privateDomain);
            done();
        })
    });

    it('should call set', done => {
        vfs.set("test", { hello: "world" }, function (err, count) {
            if (err != null) { done(err); return }
            count.should.eql({ "done": 1 });
            done();
        })
    });

    it('should set a string too', done => {
        vfs.set("test2", 'hello world', function (err, count) {
            if (err != null) { done(err); return }
            count.should.eql({ "done": 1 });
            vfs.get("test2", function (err, res) {
                res.should.eql('hello world');
                return done();
            });
        })
    });

    // this is a breaking change in v3.0.0
    // Before 3.0.0, setting a value to JSON.stringify({hello:'world'}), you would get {hello:'world'} as a result to get
    it('setting a string must get a string too', done => {
        vfs.set("test3", JSON.stringify({ hello: 'world' }), function (err, count) {
            if (err != null) { done(err); return }
            count.should.eql({ "done": 1 });
            vfs.get("test3", function (err, res) {
                res.should.eql(JSON.stringify({ hello: 'world' })); // and not an object
                return done();
            });
        })
    });


    it('should call get', done => {
        vfs.get("test", function (err, res) {
            res.should.eql({ hello: "world" });
            done();
        })
    });

    return it('should call del', done => {
        vfs.del("test", function (err, count) {
            count.should.eql({ "done": 1 });
            done();
        })
    });
});


// skipped because there's no default VFS key we can test, and we can't create one
describe.skip('Game VFS', function () {

    const gamevfs = Clan.vfs(Clan.privateDomain);

    it('should call get', done => {
        gamevfs.get("testkey", function (err, res) {
            if (err != null) { done(err); return }
            should(res).be.not.null;
            res.should.eql({ test: 2 });
            done();
        })
    });
});

