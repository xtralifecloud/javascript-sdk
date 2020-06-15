/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const agent = require('superagent');
const prefixer = require('./prefixer.js');
const ClanError = require('./ClanError.js');

let _timeout = 50000;

module.exports = (appCredentials, gamerCred, domain) => ({
    setTimeout(timeout) {
        return _timeout = timeout;
    },

    send(gamer_id, message, osn, cb) {
        if (cb == null) {
            cb = osn;
            osn = null;
        }
        const evt = { type: "user", event: message, from: gamerCred.gamer_id, to: gamer_id };
        if (osn != null) { evt.osn = osn; }
        return agent
            .post(`/v1/gamer/event/${domain}/${gamer_id}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .send(evt)
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

    sendVolatile(gamer_id, message, cb) {
        return agent
            .post(`/v1/gamer/event/volatile/${domain}/${gamer_id}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .send(message)
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

    // cb(null, null) if no message is received before timeout
    receive(ack, cb) {
        if (ack == null) { ack = 'auto'; }
        if (cb == null) {
            cb = ack;
            ack = 'auto';
        }
        return agent
            .get(`/v1/gamer/event/${domain}?ack=${ack}&timeout=${_timeout}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .end(function (err, res) {
                if (err != null) {
                    return cb(err);
                } else {
                    if (res.error) {
                        return cb(new ClanError(res.status, res.body));
                    } else {
                        if (res.status === 204) {
                            return cb(null, null);
                        } else { return cb(null, res.body); }
                    }
                }
            });
    }
});
