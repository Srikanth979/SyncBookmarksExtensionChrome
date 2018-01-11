module.exports = {
    "init": init
}

var rtDatabase = {};
function init(fbase) {
    if (fbase) {
        rtDatabase = fbase.database();;
    }
}

