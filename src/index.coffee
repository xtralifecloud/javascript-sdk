global = window = `window? window : (global? global: null)`
if window? then window.Clan = require './Clan.coffee'
