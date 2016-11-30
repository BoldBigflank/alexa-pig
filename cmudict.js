var CMUDict = function() {
    var fs = require('fs');
    this.dict = JSON.parse(fs.readFileSync('cmudict.json'));
};

CMUDict.prototype.get = function(word) {
    word = word.toLowerCase();
    if(word in this.dict){
        return this.dict[word];
    } else {
        var start = 0;
        var end = word.length - 1;
        var result = "";
        var prefix;
        while(end > 0) {
            prefix = word.substr(start, end);
            if(prefix in this.dict) {
                result += this.dict[prefix];
                start += prefix.length;
                end = word.length - start;
            } else {
                end--;
            }

        }
        return result;
        // Lose letters until we find a match
        // Start over with the rest of the word
    }
}

module.exports = new CMUDict();