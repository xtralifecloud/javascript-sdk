require('mocha')
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should = require('should');

const Clan = require('../src/Clan.js')('testgame-key', 'testgame-secret'); // app credentials

const dataset = require('./0-dataset.json');

let gamerCred = null;
let _gamer = null;

describe('Clan JS client', function () {

    before('setup', done => //require('../src/endpoints.js').set 'sandbox'
        done());

    it('should allow anonymous log in', done => {
        Clan.login(null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');

            gamerCred = Clan.createGamerCredentials(gamer);

            dataset.gamer_id = gamerCred.gamer_id;
            dataset.gamer_token = gamerCred.gamer_secret;

            Clan.login("anonymous", gamerCred.gamer_id, gamerCred.gamer_secret, function (err, gamer) {
                if (err != null) { done(err); }
                gamer.should.have.property('gamer_id');
                gamer.should.have.property('gamer_secret');
                _gamer = gamer;
                done();
            });
        })
    });

    it('should create a new friend', done => {
        Clan.login(null, function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');

            gamerCred = Clan.createGamerCredentials(gamer);

            dataset.friend_id = gamerCred.gamer_id;
            dataset.friend_token = gamerCred.gamer_secret;

            done();
        })
    });

    it('should allow log out', done => {
        Clan.withGamer(_gamer).logout(function (err) {
            should(err).be.eql(null);
            done();
        })
    });

    it('should allow to login with email', done => {
        Clan.login('email', "devteam@xtralife.cloud", "yourpassword", function (err, gamer) {
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            done();
        })
    });

    it('sould reset email password', function (done) {
        const body = "Use this code [[SHORTCODE]] to reset your password !";
        Clan.sendResetMailPassword("devteam@xtralife.cloud", "admin@xtralife.cloud", "reset your password", body, function (err, res) {
            should(err).be.undefined;
            done();
        });
    });

    it('should not allow log in with wrong credentials', done => {
        Clan.login('anonymous', dataset.gamer_id, 'wrong a1b399f71c868faf0848c959ac6b290b6169750d', function (err, gamer) {
            should(gamer).be.undefined;
            err.should.have.property('status');
            err.status.should.eql(401);
            err.response.body.message.should.eql('Invalid user credentials');
            done();
        })
    });

    it('should not allow log in with wrong FB token', done => {
        Clan.login('facebook', 'any will do', 'wrong FB token', function (err, gamer) {
            should(gamer).be.undefined;
            err.should.have.property('status');
            err.status.should.eql(401);
            err.response.body.message.should.eql('The received login token is invalid');
            done();
        })
    });

    it.skip('should accept Facebook credentials', done => {// find a FB user access token at https://developers.facebook.com/tools/accesstoken/
        Clan.login(
            'facebook',
            'any will do',
            'CAAIhTFZBxVNoBAKEmRVDHiDcxhpTAZAaEAyGaxNJWxUBaSZC9E2QuZBqfcgjK1K8Ce4DAm1BRI897OB0kGB1hJaseP1JU7WEQFhteqwV63sKXZC5089tpMuDK1igEzrfeMtXpZBZBbZC4ebm9GRSujTCL8SZBFGAJmthltAfYvLXpoJlP7qdk2ZCStnsqQ4RRAIyhWmdZB8QDVZB29NeOyO73j9NnYBWz8F1ZCP4ZD',
            function (err, gamer) {
                gamer.should.have.property('gamer_id');
                gamer.should.have.property('gamer_secret');
                done();
            }
        )
    });

    it('should allow conversion of anonymous to email', done => {
        Clan.login(null, function (err, gamer) {
            gamerCred = Clan.createGamerCredentials(gamer);
            const mail = "test" + Math.random() + "@localhost.localdomain";
            const password = "password";

            Clan.withGamer(gamer).convertTo("email", mail, password, function (err, result) {
                if (err != null) { return done(err); }
                result.done.should.eql(1);

                Clan.login('email', mail, password, (err, result) => done(err));
            });
        })
    });

    it.skip('should log in/out fast', function (done) {
        this.timeout(100000);
        const fn = cb => Clan.login('anonymous', dataset.gamer_id, dataset.gamer_token, function (err, gamer) {
            if (err != null) { return cb(err); }
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            gamerCred = Clan.createGamerCredentials(gamer);

            Clan.withGamer(gamer).logout(err => cb(err));
        });

        const array = __range__(1, 200, true);

        let counter = 0;
        const cb = function (err) {
            if (err != null) { console.log(err); }
            counter++;
            if (counter === array.length) { return done(); }
        };

        setInterval(() => console.log(`${counter} / ${array.length}`)
            , 1000);

        Array.from(array).map((each) => fn(cb));
    });

    it.skip('should echo fast', function (done) {
        this.timeout(100000);
        const fn = cb => Clan.echo(function (err) {
            if (err != null) { return cb(err); }
            Clan.echo(function (err) {
                if (err != null) {
                    return cb(err);
                } else { return cb(null); }
            });
        });

        const array = __range__(1, 200, true);

        let counter = 0;
        const cb = function (err) {
            if (err != null) { console.log(err); }
            counter++;
            if (counter === array.length) { return done(); }
        };

        setInterval(() => console.log(`${counter} / ${array.length}`)
            , 1000);

        Array.from(array).map((each) => fn(cb));
    });
});

function __range__(left, right, inclusive) {
    let range = [];
    let ascending = left < right;
    let end = !inclusive ? right : ascending ? right + 1 : right - 1;
    for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
        range.push(i);
    }
    return range;
}