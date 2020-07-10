const memStore = {};

function addVal(refId, val) {
    memStore[refId] = memStore[refId] || 0;
    memStore[refId] += val;
}

function read(refId) {
    return memStore[refId];
}

module.exports = {
    addVal,
    read
}
