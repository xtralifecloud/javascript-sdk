/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const agent = require('superagent');
const prefixer = require('./prefixer.js');
const ClanError = require('./ClanError.js');

module.exports = (appCredentials, domain) => ({
    set(indexName, id, properties, payload, cb) {
        const index = {
            id,
            properties,
            payload
        };
        return agent
            .post(`/v1/index/${domain}/${indexName}`)
            .use(prefixer)
            .set(appCredentials)
            .type('json')
            .send(index)
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

    get(indexName, id, cb) {
        return agent
            .get(`/v1/index/${domain}/${indexName}/${id}`)
            .use(prefixer)
            .set(appCredentials)
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

    del(indexName, id, cb) {
        return agent
            .del(`/v1/index/${domain}/${indexName}/${id}`)
            .use(prefixer)
            .set(appCredentials)
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

    search(indexName, q, sort, skip, limit, cb) {
        let query = `?q=${encodeURIComponent(q)}`;
        if (skip != null) { query += `&from=${skip}`; }
        if (limit != null) { query += `&max=${limit}`; }
        if (sort != null) { query += `&sort=${encodeURIComponent(sort)}`; }
        return agent
            .post(`/v1/index/${domain}/${indexName}/search${query}`)
            .use(prefixer)
            .set(appCredentials)
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

    query(indexName, query, skip, limit, cb) {
        let param = `?from=${(skip != null) ? Number(skip) : 0}`;
        if (limit != null) { param += `&max=${limit}`; }
        return agent
            .post(`/v1/index/${domain}/${indexName}/search${param}`)
            .use(prefixer)
            .set(appCredentials)
            .type('json')
            .send(query)
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


