should = require 'should'

Clan = require('../src/Clan.coffee')('cloudbuilder-key', 'azerty')

dataset = require './0-dataset.json'

gamerCred = null

describe 'Gamer Leaderboards', ->

	leaderboards = Clan.leaderboards()

	describe "score as friend ", ->

		it 'it should login first as friend', (done)->
			Clan.login 'anonymous', dataset.friend_id, dataset.friend_token, (err, gamer)->
				gamer.should.have.property('gamer_id')
				gamer.should.have.property('gamer_secret')
				gamerCred = Clan.createGamerCredentials(gamer)
				done()

		it 'should set a score', (done)->
			leaderboards.set gamerCred, "level1", "hightolow", { score : 20, info : "using mickey"}, (err, res)->
				res.should.have.property("done")
				done()

		it 'should set another score', (done)->
			leaderboards.set gamerCred, "level2", "lowtohigh", { score : 110, info : "using minie"}, (err, res)->
				res.should.have.property("done")
				done()

		it "should get user's scores", (done)->
			leaderboards.get gamerCred, (err, res)->
				res.should.have.property "level1"
				res.level1.should.have.property "score"
				res.should.have.property "level2"
				res.level2.should.have.property "score"
				done()

	describe "score as gamer ", ->

		it 'it should login as gamer', (done)->
			Clan.login 'anonymous', dataset.gamer_id, dataset.gamer_token, (err, gamer)->
				gamer.should.have.property('gamer_id')
				gamer.should.have.property('gamer_secret')
				gamerCred = Clan.createGamerCredentials(gamer)
				done()

		it 'should set a score', (done)->
			leaderboards.set gamerCred, "level1", "hightolow", { score : 10, info : "using mickey"}, (err, res)->
				res.should.have.property("done")
				done()

		it 'should set another score', (done)->
			leaderboards.set gamerCred, "level2", "lowtohigh", { score : 100, info : "using minie"}, (err, res)->
				res.should.have.property("done")
				done()

		it "should get user's scores", (done)->
			leaderboards.get gamerCred, (err, res)->
				res.should.have.property "level1"
				res.level1.should.have.property "score"
				res.should.have.property "level2"
				res.level2.should.have.property "score"
				done()

		it "should get 10 best highscore on level1", (done)->
			leaderboards.getHighscores gamerCred, "level1", "hightolow", 1, 10, (err, res)->
				res.should.have.property "level1"
				res.level1.should.have.property "scores"
				done()

		it "should get 10 best highscore on level2", (done)->
			leaderboards.getHighscores gamerCred, "level2", "lowtohigh", 1, 10, (err, res)->
				res.should.have.property "level2"
				res.level2.should.have.property "scores"
				done()
