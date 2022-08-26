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

describe('Batches', function () {

    let savedGamer = null;

    it.skip('should allow calling unauthenticated batches', done => {
        Clan.runBatch("private", 'batchFromJS', { params: "work fine" }, function (err, res) {
            if (err != null) { return done(err); }
            res.works.should.eql(true);
            res.params.request.should.eql({ params: 'work fine' });
            done();
        })
    });

    it('should log in', done => {
        Clan.login(null, null, null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            savedGamer = gamer;
            done();
        })
    });

    return it.skip('should allow calling authenticated batches', done => {
        Clan.withGamer(savedGamer).runBatch("private", 'batchFromJS', { params: "work fine" }, function (err, res) {
            if (err != null) { done(err); return }
            res.works.should.eql(true);
            res.params.request.should.eql({ params: 'work fine' });
            res.params.user_id.should.eql(savedGamer.gamer_id);
            //res.params.gamer_id.should.eql savedGamer.gamer_id
            done();
        })
    });
});

