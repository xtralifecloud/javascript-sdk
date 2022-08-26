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

describe('Gamer transactions', function () {

    let balance = null;
    let history = null;

    let tx = null;

    it('it should login first', done => {
        Clan.login(null, null, null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            tx = Clan.withGamer(gamer).transactions(Clan.privateDomain);
            done();
        })
    });

    it('should call balance', done => {
        tx.balance(function (err, aBalance) {
            if (err != null) { return done(err); }
            balance = aBalance;
            done();
        })
    });

    it('should call history', done => {
        tx.history(null, 0, 1000, function (err, aHistory) {
            if (err != null) { done(err); return }
            ({
                history
            } = aHistory);
            if (history.length > 900) {
                console.log("WARNING : history will soon become too large for unit tests");
            }
            done();
        })
    });

    it('should send a transaction', done => {
        tx.create({ Gold: 100 }, 'jsclient test', function (err, result) {
            const aBalance = result.balance;
            if (err != null) { done(err); return }
            aBalance.Gold.should.eql(100 + (balance.Gold || 0));
            balance = aBalance;
            done();
        })
    });

    it('should reset Gold balance to 0', done => {
        tx.create({ Gold: -balance.Gold, Silver: 1 }, 'jsclient test', function (err, result) {
            const aBalance = result.balance;
            if (err != null) { done(err); return }
            aBalance.Gold.should.eql(0);
            done();
        })
    });

    it('should report an error if trying to withdraw too much', done => {
        tx.create({ Gold: -1 }, 'jsclient test', function (err, result) {
            err.status.should.eql(400);
            err.response.body.name.should.eql('BalanceInsufficient');
            should(result).be.undefined;
            done();
        })
    });

    it('should call history again', done => {
        tx.history(null, 0, 1000, function (err, aHistory) {
            if (err != null) { done(err); return }
            aHistory.history.length.should.eql(history.length + 2);
            ({
                history
            } = aHistory);
            done();
        })
    });

    it('should call history with unit param too', done => {
        tx.history('Silver', 0, 1000, function (err, aHistory) {
            if (err != null) { done(err); return }
            aHistory.history.length.should.be.lessThan(history.length);
            done();
        })
    });
});
