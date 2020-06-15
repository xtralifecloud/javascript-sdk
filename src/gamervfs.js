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
    getValue(key, cb) {
        if (key == null) { key = ''; }
        return agent
            .get(`/v3.0/gamer/vfs/${domain}/${key}`)
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

    get(key, cb) {
        if (key == null) { key = ''; }
        return agent
            .get(`/v1/gamer/vfs/${domain}/${key}`)
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

    setValue(key, value, cb) {
        if (key == null) { key = ''; }
        return agent
            .put(`/v3.0/gamer/vfs/${domain}/${key}`)
            .use(prefixer)
            .type('json')
            .send(value)
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
            .put(`/v1/gamer/vfs/${domain}/${key}`)
            .use(prefixer)
            .type('json')
            .send(JSON.stringify(value))
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

    deleteValue(key, cb) {
        if (key == null) { key = ''; }
        return agent
            .del(`/v3.0/gamer/vfs/${domain}/${key}`)
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

    del(key, cb) {
        if (key == null) { key = ''; }
        return agent
            .del(`/v1/gamer/vfs/${domain}/${key}`)
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

    setBinary(key, cb) {
        if (key == null) { cb(new Error("setBinary needs a key to be able to upload data")); }
        return agent
            .put(`/v3.0/gamer/vfs/${domain}/${key}?binary`)
            .use(prefixer)
            .type('json')
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

