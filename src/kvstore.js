/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const agent = require('superagent');
const prefixer = require('./prefixer.js');
const ClanError = require('./ClanError.js');

// TODO support getting/setting/deleting all keys at once

module.exports = (appCredentials, gamerCred, domain) => ({
    get(key, cb) {
        if (key == null) { key = ''; }
        return agent
            .get(`/v1/gamer/kv/${domain}/${key}`)
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

    set(key, value, cb) {
        if (key == null) { key = ''; }
        return agent
            .post(`/v1/gamer/kv/${domain}/${key}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .type('json')
            .send({
                value
            })
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

    del(key, cb) {
        if (key == null) { key = ''; }
        return agent
            .del(`/v1/gamer/kv/${domain}/${key}`)
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

    acl(key, acl, cb) {
        if (key == null) { key = ''; }
        return agent
            .post(`/v1/gamer/kv/${domain}/${key}/acl`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .type('json')
            .send({
                acl
            })
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
