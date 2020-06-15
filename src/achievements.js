/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const agent = require('superagent');
const prefixer = require('./prefixer.js');
const ClanError = require('./ClanError.js');

module.exports = (appCredentials, gamerCred, domain) => ({
    list(cb) {
        return agent
            .get(`/v1/gamer/achievements/${domain}`)
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

    associateData(name, data, cb) {
        return agent
            .post(`/v1/gamer/achievements/${domain}/${name}/gamerdata`)
            .use(prefixer)
            .set(appCredentials)
            .send(data)
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
