var endpoint;

module.exports = {

    set(newEndpoint) {
        if (newEndpoint != null) {
            endpoint = newEndpoint;
        } else { throw new Error("endpoint must be defined"); }
    },

    get() {
        return endpoint;
    },
};