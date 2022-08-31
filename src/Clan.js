/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const agent = require('superagent');
// @ts-ignore
if (agent.Request.prototype.use == null) {
    // @ts-ignore
    agent.Request.prototype.use = function(fn) {
        fn(this);
        return this;
    };
}

const prefixer = require('./prefixer.js');
const ClanError = require('./ClanError.js');
const Endpoint = require('./endpoint.js');

// @ts-ignore

module.exports = function Clan(apikey, apisecret, endpoint) {

    if (endpoint != null) {
        Endpoint.set(endpoint); }

    const appCredentials = { 'x-apikey': apikey, 'x-apisecret': apisecret };

    return {
        createLoginCredentials(id, secret) {
            return { id: id, secret: secret };
        },

        createGamerCredentials(gamer) {
            return { gamer_id: gamer.gamer_id, gamer_secret: gamer.gamer_secret };
        },

        loginAnonymous(osn, options, cb) {
            return agent.post('/v1/login/anonymous')
                .use(prefixer)
                .send({ osn, options })
                .set(appCredentials)
                .end(function(err, res) {
                    if (err != null) {
                        return cb(err);
                    } else {
                        if (res.error) {
                            return cb(new ClanError(res.status, res.error));
                        } else { return cb(null, res.body, true); }
                    }
                });
        }, // Maybe we can delete this one, as login() function will do this automatically if we don't pass any network parameters ?

        login(network, credentials, options, cb) {
            if (typeof options === "function") {
                cb = options;
                options = null;
            }

            if (network != null) {
                return agent
                    .post('/v1/login')
                    .use(prefixer)
                    .send({ network, credentials, options })
                    .set(appCredentials)
                    .end(function(err, res) {
                        if (err != null) {
                            return cb(err);
                        } else {
                            if (res.error) {
                                return cb(new ClanError(res.status, res.body));
                            } else { return cb(null, res.body, false); }
                        }
                    });
            } else {
                return agent
                    .post('/v1/login/anonymous')
                    .use(prefixer)
                    .set(appCredentials)
                    .send({ options })
                    .end(function(err, res) {
                        if (err != null) {
                            return cb(err);
                        } else {
                            if (res.error) {
                                return cb(new ClanError(res.status, res.body));
                            } else { return cb(null, res.body, true); }
                        }
                    });
            }
        },

        resumeSession(id, secret, cb) {
            return this.login("anonymous", this.createLoginCredentials(id, secret), { preventRegistration: true }, cb);
        },

        loginWithShortCode(shortCode, cb) {
            const credentials = this.createLoginCredentials("", shortCode);
            return this.login("restore", credentials, { preventRegistration: true }, cb);
        },

        runBatch(domain, batchName, params, cb) {
            return agent
                .post(`/v1/batch/${domain}/${batchName}`)
                .use(prefixer)
                .set(appCredentials)
                .send(params)
                .end(function(err, res) {
                    if (err != null) {
                        return cb(err);
                    } else {
                        if (res.error) {
                            return cb(new ClanError(res.status, res.body));
                        } else { return cb(null, res.body); }
                    }
                });
        },

        vfs(domain) {
            if (domain == null) { domain = 'private'; }
            return require('./gamevfs.js')(appCredentials, domain);
        },

        indexes(domain) {
            if (domain == null) { domain = 'private'; }
            return require('./indexes.js')(appCredentials, domain);
        },

        // the mailBody will be parsed to replace occurences of [[SHORTCODE]] by actual shortcode
        sendResetMailPassword(userEmail, mailSender, mailTitle, mailBody, cb) {
            let textBody = "[[SHORTCODE]]";
            let htmlBody = null;
            if (typeof mailBody === "object") {
                if (mailBody.html === true) {
                    htmlBody = mailBody.body;
                } else {
                    textBody = mailBody.body;
                }
            } else {
                textBody = mailBody;
            }
            const body = {
                from: mailSender,
                title: mailTitle,
                body: textBody
            };
            if (htmlBody !== null) { body.html = htmlBody; }

            return agent
                .post(`/v1/login/${userEmail}`)
                .use(prefixer)
                .set(appCredentials)
                .send(body)
                .end(function(err, res) {
                    if (err != null) {
                        return cb(err);
                    } else {
                        if (res.error) {
                            return cb(new ClanError(res.status, res.body));
                        } else { return cb(null, res.body); }
                    }
                });
        },

        userExists(network, id, cb) {
            return agent
                .get(`/v1/users/${network}/${encodeURIComponent(id)}`)
                .use(prefixer)
                .set(appCredentials)
                .end(function(err, res) {
                    if (err != null) {
                        return cb(err);
                    } else {
                        if (res.error) {
                            return cb(new ClanError(res.status, res.body));
                        } else { return cb(null, res.body); }
                    }
                });
        },

        withGamer(gamer) {
            const creds = this.createGamerCredentials(gamer);

            return {
                transactions(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./transactions.js')(appCredentials, creds, domain);
                },

                gamervfs(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./gamervfs.js')(appCredentials, creds, domain);
                },

                friends(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./friends.js')(appCredentials, creds, domain);
                },

                profile() {
                    return require('./profile.js')(appCredentials, creds);
                },

                properties(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./properties.js')(appCredentials, creds, domain);
                },

                leaderboards(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./leaderboards.js')(appCredentials, creds, domain);
                },

                matches(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./matches.js')(appCredentials, creds, domain);
                },

                kv(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./kvstore.js')(appCredentials, creds, domain);
                },

                events(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./event.js')(appCredentials, creds, domain);
                },

                achievements(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./achievements.js')(appCredentials, creds, domain);
                },

                referral(domain) {
                    if (domain == null) { domain = 'private'; }
                    return require('./referral.js')(appCredentials, creds, domain);
                },

                store() {
                    return require('./store.js')(appCredentials, creds);
                },

                runBatch(domain, batchName, params, cb) {
                    return agent
                        .post(`/v1/gamer/batch/${domain}/${batchName}`)
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .send(params)
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                },

                outline(cb) {
                    return agent
                        .get('/v1/gamer/outline')
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                },

                convertTo(network, credentials, cb) {
                    return agent
                        .post('/v1/gamer/convert')
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .send({ network, credentials })
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                },

                link(network, id, secret, cb) {
                    return agent
                        .post('v1/gamer/link')
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .send({ network, id, secret })
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                },

                unlink(network, cb) {
                    return agent
                        .post('v1/gamer/unlink')
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .send({ network })
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                },

                logout(cb) {
                    return agent
                        .post('/v1/gamer/logout')
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                },

                changeEmail(newEmailAddress, cb) {
                    return agent
                        .post('/v1/gamer/email')
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .send({ email: newEmailAddress })
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                },

                changePassword(newPassword, cb) {
                    return agent
                        .post('/v1/gamer/password')
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .send({ password: newPassword })
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                },

                listUsers(filter, limit, skip, cb) {
                    return agent
                        .get(`/v1/gamer?q=${encodeURIComponent(filter)}&limit=${limit}&skip=${skip}`)
                        .use(prefixer)
                        .set(appCredentials)
                        .auth(creds.gamer_id, creds.gamer_secret)
                        .end(function(err, res) {
                            if (err != null) {
                                return cb(err);
                            } else {
                                if (res.error) {
                                    return cb(new ClanError(res.status, res.body));
                                } else { return cb(null, res.body); }
                            }
                        });
                }
            };
        },

        privateDomain: 'private'
    };
};