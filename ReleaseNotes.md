# Release notes

### Jul 1, 2015

Added `Clan.runBatch(domain, batchName, params, cb)` and `Clan.withGamer(creds).runBatch(domain, batchName, params, cb)` to run an unauthenticated or authenticated batch. 
In the called batch, `params.user_id` is set for authenticated batches only, and `params.request` contains the `params` argument of `runBatch`.

Updated SuperAgent to newest version to ensure node 0.10, 0.12 and iojs compatibility.