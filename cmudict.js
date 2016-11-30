var CMUDict = function() {
    var fs = require('fs');
    this.dict = JSON.parse(fs.readFileSync('cmudict.json'));
};

CMUDict.prototype.get = function(word) {
    return this.dict[word.toLowerCase()];
}

module.exports = new CMUDict();