/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const agent = require('superagent');
const prefixer = require('./prefixer.js');
const ClanError = require('./ClanError.js');

module.exports = (appCredentials, gamerCred, domain) => //list: (properties, options=null, cb)->
    ({
        list(options, cb) {

            //queryoptions = "&properties=#{JSON.stringify(properties)}"
            let queryoptions = "";
            if ((options != null ? options.full : undefined) != null) { queryoptions += "&full"; }
            if ((options != null ? options.participating : undefined) != null) { queryoptions += "&participating"; }
            if ((options != null ? options.finished : undefined) != null) { queryoptions += "&finished"; }
            if ((options != null ? options.invited : undefined) != null) { queryoptions += "&invited"; }
            if ((options != null ? options.skip : undefined) != null) { queryoptions += `&skip=${options.skip}`; }
            if ((options != null ? options.limit : undefined) != null) { queryoptions += `&limit=${options.limit}`; }

            return agent
                .get(`/v1/gamer/matches?domain=${domain}${queryoptions}`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        create(matchData, cb) {
            return agent
                .post(`/v1/gamer/matches?domain=${domain}`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .type('json')
                .send(matchData)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        get(matchID, cb) {
            return agent
                .get(`/v1/gamer/matches/${matchID}`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        del(matchID, cb) {
            return agent
                .del(`/v1/gamer/matches/${matchID}`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        join(matchID, osn, cb) {
            return agent
                .post(`/v1/gamer/matches/${matchID}/join`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .type('json')
                .send(osn)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        leave(matchID, osn, cb) {
            return agent
                .post(`/v1/gamer/matches/${matchID}/leave`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .type('json')
                .send(osn)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        invite(matchID, friendID, osn, cb) {
            return agent
                .post(`/v1/gamer/matches/${matchID}/invite/${friendID}`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .type('json')
                .send(osn)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        dismiss(matchID, cb) {
            return agent
                .del(`/v1/gamer/matches/${matchID}/invitation`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        move(matchID, lastEventID, move, globalState, osn, cb) {
            if (cb == null) {
                cb = osn;
                osn = null;
            }
            if (cb == null) {
                cb = globalState;
                globalState = null;
            }

            if (osn != null) { move.osn = osn; }

            const message = { move };
            if (globalState != null) { message.globalState = globalState; }

            return agent
                .post(`/v1/gamer/matches/${matchID}/move?lastEventId=${lastEventID}`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .type('json')
                .send(message)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        finish(matchID, lastEventID, osn, cb) {
            return agent
                .post(`/v1/gamer/matches/${matchID}/finish?lastEventId=${lastEventID}`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .type('json')
                .send(osn)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        },

        draw(matchID, lastEventID, count, osn, cb) {
            return agent
                .post(`/v1/gamer/matches/${matchID}/shoe/draw?lastEventId=${lastEventID}&count=${count}`)
                .use(prefixer)
                .set(appCredentials)
                .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
                .type('json')
                .send(osn)
                .end(function (err, res) {
                    if (err != null) { return cb(err); }
                    if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
                });
        }
    });
