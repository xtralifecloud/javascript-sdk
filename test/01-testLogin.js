require('mocha')
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should = require('should');

const Clan = require('../src/Clan.js')('testgame-key', 'testgame-secret', 'http://localhost:2000'); // app credentials
const Endpoint = require('../src/endpoint.js');
const dataset = require('./0-dataset.json');

let gamerCred = null;
let _gamer = null;

describe('Clan JS client', function () {

    before('setup', done => //require('../src/endpoints.js').set 'sandbox'
        done());

    
        it("should get the endpoint and return http://localhost:2000", () => {
            console.log(Endpoint.get());
        })

    it('should alloOOOOOOOOOw anonymous log in', done => {
        
            Clan.loginAnonymous(null, null, function (err, gamer) {console.log(Endpoint.get());
                if (err != null) { done(err); }
                gamer.should.have.property('gamer_id');
                gamer.should.have.property('gamer_secret');
                dataset.gamer_id = gamer.gamer_id;
                dataset.gamer_token = gamer.gamer_secret;
                _gamer = gamer;
                done();
            });

    });

    it('should create a new friend', done => {
        Clan.loginAnonymous(null, null, function (err, gamer) {
            if (err != null) { done(err); }
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            dataset.friend_id = gamer.gamer_id;
            dataset.friend_token = gamer.gamer_secret;
            _gamer = gamer;
            done();
        });
    });

    it('should allow log out', done => {
        Clan.withGamer(_gamer).logout(function (err) {
            should(err).be.eql(null);
            done();
        })
    });

    it('should allow to login with email', done => {
        credentials = {id: 'devteam@xtralife.cloud', secret: 'yourpassword'};
        Clan.login('email', credentials, null, function (err, gamer) {
            if (err != null) { done(err); }
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            done();
        })
    });

    it('should reset email password', function (done) {
        const body = "Use this code [[SHORTCODE]] to reset your password !";
        Clan.sendResetMailPassword("devteam@xtralife.cloud", "admin@xtralife.cloud", "reset your password", body, function (err, res) {
            should(err).be.undefined;
            done();
        });
    });

    it('should not allow log in with wrong credentials', done => {
        credentials = {id: dataset.gamer_id, secret: 'wrong a1b399f71c868faf0848c959ac6b290b6169750d'}
        Clan.login('anonymous', credentials, null, function (err, gamer) {
            should(gamer).be.undefined;
            done();
        })
    });

    it('should not allow log in with wrong FB token', done => {
        credentials = {auth_token: "wrong FB token"}
        Clan.login('facebook', credentials, null, function (err, gamer) {
            should(gamer).be.undefined;
            err.should.have.property('status');
            err.response.body.details.code.should.eql(190);
            done();
        })
    });

    it('should accept Facebook credentials', done => { // find a FB user access token at https://developers.facebook.com/tools/accesstoken/
        credentials = {auth_token: 'EAAEq3gnqZAOwBASD3T9M9LF7cUPrTTFAnfmQglQmtA0TkeRLLmJURVrGPlUhgX0LJQVZBvLXSCQKID5BVBiqonvt6QGlYfxfNVZAYbxhcslDzL1ZCoZBnAnK1wnRvzlmOEVJb3ZB5Uzcafd787UItNtq3fTyMh4Oxjsf0ojckE4gZDZD'}
        Clan.login('facebook', credentials, null, function (err, gamer) {
            if (err != null) { done(err); }
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            done();
        })
    });

    it('should allow conversion of anonymous to email', done => {         
        Clan.loginAnonymous(null, null, function (err, gamer) {
            if (err != null) { done(err); }
            gamer.should.have.property('gamer_id');
            gamer.should.have.property('gamer_secret');
            const mail = "test" + Math.random() + "@localhost.localdomain";
            const password = "password";
            credentials = Clan.createLoginCredentials(mail, password);
            Clan.withGamer(gamer).convertTo("email", credentials, function (err, result) {
                if (err != null) { return done(err); }
                result.done.should.eql(1);
                Clan.login('email', credentials, null, (err, result) => done(err));
            }
            )})
    });

    it.skip('should log in/out fast', function (done) {
        credentials = {id: dataset.gamer_id, secret: dataset.gamer_token}
        this.timeout(100000);
        const fn = cb => Clan.login('anonymous', credentials, null, function (err, gamer) {
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