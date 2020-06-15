/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const agent = require('superagent');
const prefixer = require('./prefixer.js');
const ClanError = require('./ClanError.js');

module.exports = (appCredentials, gamerCred) => ({
    get(cb) {
        return agent
            .get("/v1/gamer/profile")
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .end(function (err, res) {
                if (err != null) {
                    return cb(err);
                } else {
                    if (res.error) {
                        return cb(new ClanError(res.status, res.body));
                    } else { return cb(null, res.body); }
                }
            });
    },

    set(newProfile, cb) {
        if (key == null) { var key = ''; }
        return agent
            .post("/v1/gamer/profile")
            .use(prefixer)
            .type('json')
            .send(newProfile)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .end(function (err, res) {
                if (err != null) {
                    return cb(err);
                } else {
                    if (res.error) {
                        return cb(new ClanError(res.status, res.body));
                    } else { return cb(null, res.body); }
                }
            });
    }
});
