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

describe('KV store', function () {

    let kv = null;

    it('it should login first', done => {
        Clan.login(null, null, null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            kv = Clan.withGamer(gamer).kv(Clan.privateDomain);
            done();
        })
    });

    // skipped because it doesn't exist by default
    it.skip('should call get', done => {
        kv.get("testjskey", function (err, res) {
            if (err != null) { done(err); return }
            should.exist(res.key);
            res.key.should.eql("testjskey");
            done();
        })
    });

    it('should call set', done => {
        kv.set("testjskey", "hello", function (err, res) {
            if (err != null) { done(err); return }
            should.exist(res.ok);
            res.ok.should.eql(1);
            done();
        })
    });

    it('should change acl', done => {
        kv.acl("testjskey", { r: '*', w: '*', a: '*' }, function (err, res) {
            if (err != null) { done(err); return }
            should.exist(res.ok);
            res.ok.should.eql(1);
            done();
        })
    });
});
