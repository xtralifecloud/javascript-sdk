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
    post(score, board, order, info, force, cb) {
        return agent
            .post(`/v2.6/gamer/scores/${domain}/${board}?order=${order}&force=${force}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .send({ score, info })
            .end(function (err, res) {
                if (err != null) { return cb(err); }
                if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
            });
    },

    getRank(score, board, cb) {
        return agent
            .put(`/v2.6/gamer/scores/${domain}/${board}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .send(score)
            .end(function (err, res) {
                if (err != null) { return cb(err); }
                if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
            });
    },

    set(board, order, score, cb) {
        return agent
            .post(`/v2.6/gamer/scores/${domain}/${board}?order=${order}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .send(score)
            .end(function (err, res) {
                if (err != null) { return cb(err); }
                if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
            });
    },

    get(cb) {
        return agent
            .get(`/v2.6/gamer/bestscores/${domain}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .end(function (err, res) {
                if (err != null) { return cb(err); }
                if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
            });
    },

    getHighscores(board, page, count, cb) {
        return agent
            .get(`/v2.6/gamer/scores/${domain}/${board}?page=${page}&count=${count}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .end(function (err, res) {
                if (err != null) { return cb(err); }
                if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
            });
    },

    getFriendsHighscores(board, page, count, cb) {
        return agent
            .get(`/v2.6/gamer/scores/${domain}/${board}?page=${page}&count=${count}&type=friendscore`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .end(function (err, res) {
                if (err != null) { return cb(err); }
                if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
            });
    },

    getCenteredHighscores(board, count, cb) {
        return agent
            .get(`/v2.6/gamer/scores/${domain}/${board}?page=me&count=${count}`)
            .use(prefixer)
            .set(appCredentials)
            .auth(gamerCred.gamer_id, gamerCred.gamer_secret)
            .end(function (err, res) {
                if (err != null) { return cb(err); }
                if (res.error) { return cb(new ClanError(res.status, res.body)); } else { return cb(null, res.body); }
            });
    }
});
